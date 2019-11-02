var DataTypes = require('sequelize/lib/data-types')
module.exports=(sequelize,Datatypes) =>{
    const User = sequelize.define('user',{
        id:{
            type:Datatypes.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
        name: {
            type: Datatypes.STRING,
            allowNull: true,
         
        },
        password:{
            type:Datatypes.STRING,
            isAlphanumeric: true,
            allowNull:true
        },
        role: {
            type :DataTypes.BOOLEAN,
            defaultValue: false
          },
    },
    {
        paranoid:true,
        timestamps:false,
        freezeTableName: true
    }
    )
    return User;
}