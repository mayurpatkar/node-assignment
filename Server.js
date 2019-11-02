const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const Sequelize = require('sequelize');
const UserModel = require('./Models/user');
const GroupModel = require('./Models/group');
const UserGroupModel = require('./Models/user_group');
var Op = Sequelize.Op;
require('dotenv').config(); 
const mysql = require('mysql2');

var app = express();
const port = 3000;
const connection = new Sequelize('cromocrush','root','root',{
    dialect:'mysql'
})

app.use(bodyParser.json());
 
const secret = 'passportjwt';
const User = UserModel(connection, Sequelize)
const Group = GroupModel(connection, Sequelize)
const User_Group = UserGroupModel(connection, Sequelize)

User.belongsToMany(Group, {
    through: User_Group, //this can be string or a model,
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'no action'
});

Group.belongsToMany(User, {
    through: User_Group,
    foreignKey: 'group_id',
    onDelete: 'CASCADE',
    onUpdate: 'no action'
});

connection.sync({
        loging:true
        ,force:true
})
.then((data) =>{
    console.log('Connection established successfully.');
    app.listen(port,() =>{
        console.log('Running server on port '+ port);
    })
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

    /// Add User to database
    app.post('/addUser', async(req, res,next) => {        
        try{

        User.create({
            name: req.body.name,
            password: req.body.password
            
        })
        .then(newUser =>{
                res.json(newUser);
            })
         } catch (err) {
                next(err);
              }
        }
    )

    // Api for get users list
    app.post('/getUser', async(req, res,next) => {
        try{
        User.findAll({

        })
        .then(newUser =>{
            res.json(newUser);
        })
        } 
        catch (err) {
            next(err);
        }
    })

    //Api for create group
    app.post('/createGroup', async(req, res,next) => {
        try{
         var user_id = req.body.user_id;
            User.update({
                role: true,
            }, {
                where: {
                    id: user_id
                },
            })
            .then(async function(){
                await Group.create({
                    name: req.body.groupName,
                })
               .then(function(data){
                    User_Group.create({
                       user_id: user_id,
                       group_id:data.id
                    })
                    .then(result =>{
                        res.json(result);
                    })        
                })
            })
        }
        catch (err) {
                next(err);
        }
    })

//API of add memember
app.post('/addMember', async(req, res,next) => {
    try{
     var user_id = req.body.user_id;
     var users = req.body.users;
     console.log("the value of users is",users)
        User.findOne({
            where:{
              id:user_id
            },
            attributes:['role'],
            raw:true
        })
        .then(async function(role){
            console.log("the value of role is",role.role)
            if( role.role != 1){
                console
                res.json({success:false});
            }
            else{
                await User_Group.findOne({
                    where:{
                      user_id:user_id
                    },
                    attributes:['group_id'],
                    raw:true
                })
                .then(async function(groupid){
                    console.log("the value of group is",groupid.group_id)
                    return User_Group.findAll({
                                where:{
                                    user_id: {$in:users},
                                    group_id:groupid.group_id
                                },
                                attributes:['user_id']              
                    }) 
                    .then(async function(promiseArr){
                        var  array2 = promiseArr.map(cust => cust.user_id);
                        console.log("array2",array2);
                        var arrdiff = users.filter(x => !array2.includes(x.user_id));
                        arrdiff.forEach((user) => {
                            console.log("the value of user is",user)
                            User_Group.create({
                                user_id: user,
                                group_id:groupid.group_id
                            }) 
                        })
                        res.json({success:true});
                    })    
                })           
            }
        })
    }
    catch (err) {
        next(err);
    }
})

//Remove user from group
app.post('/removeMember', async(req, res,next) => {
    try{
     var user_id = req.body.user_id;
     var users = req.body.users;
     console.log("the value of users is",users)
        User.findOne({
            where:{
              id:user_id
            },
            attributes:['role'],
            raw:true
        })
        .then(async function(role){
            console.log("the value of role is",role.role)
            if( role.role != 1){
                res.json({success:false});
            }
            else{
                await User_Group.findOne({
                    where:{
                      user_id:user_id
                    },
                    attributes:['group_id'],
                    raw:true
                })
                .then(async function(groupid){
                    console.log("the value of group is",groupid.group_id)
                    return User_Group.findAll({
                        where:{
                            user_id: users,
                            group_id:groupid.group_id
                        },
                        attributes:['id']              
                    }) 
                    .then(async function(promiseArr){
                        console.log("^^^^^^^^^^^^^^^^^^^",promiseArr)
                        let array2 = promiseArr.map(cust => cust.id);
                        console.log("the value of array2",array2)
                        array2.forEach((id) => {
                         User_Group.destroy({
                                where:{
                                    id:id
                                }
                            })                      
                        })
                        res.json({success:true});     
                    })    
                })           
            }
        })
    }
    catch (err) {
        next(err);
    }
})

//Fetch Group
app.post('/fetchGroup', async(req, res,next) => {
    try{
    User_Group.findAll({
        where:{
            user_id:req.body.user_id
        },
        attributes:['group_id']
    }).then(newUser =>{
        let array2 = newUser.map(cust => cust.group_id);
            Group.findAll({
                   where:{
                       id:{[Op.in]:array2}
                   },
                   attributes:['id','name'],
                   raw:true
               }) 
                .then(result =>{
                     res.json(result);
                    })
                })
            } 
            catch (err) {
                next(err);
            }
})

// Api for get users list
app.post('/getGroup', async(req, res,next) => {
    try{
    Group.findAll({

    }).then(group =>{
        res.json(group);
        })
    } 
    catch (err) {
        next(err);
    }
})

//Api to fetch the Group infromation
app.post('/groupdata', async(req, res,next) => {
    try{
    Group.findAll({
        where:{
            id:req.body.group_id
        }

    }).then(function(group){
        console.log("^^^^^^^^^^^^^^^^^^",group.length)
        if(group.length < 1){
            res.json({success:false});
        }
        else{
            res.json(group);
        }
       
        })
     } catch (err) {
            next(err);
          }
    }
)

// Delete group
app.post('/deleteGroup', async(req, res,next) => {
    try{
     var user_id = req.body.user_id;  
    //  console.log("the value of users is",users)
        User.findOne({
            where:{
              id:user_id
            },
            attributes:['role'],
            raw:true
        })
        .then(async function(role){
            console.log("the value of role is",role.role)
            if( role.role != 1){
                console
                res.json({success:false});
            }
            else{
                await User_Group.findOne({
                    where:{
                      user_id:user_id
                    },
                    attributes:['group_id'],
                    raw:true
                })
                .then(async function(groupid){
                    console.log("the value of group is",groupid.group_id)
                    return Group.destroy({
                            where:{
                                id:groupid.group_id
                            },
                            raw:true             
                    }) 
                    .then(async function(){
                         res.json({success:true});
                    })    
                })           
            }
        })
    }
    catch (err) {
        next(err);
    }
})

