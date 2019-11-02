module.exports = (sequelize,DataTypes) =>{
    const User_Group = sequelize.define('user_group',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
        user_id:{
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            },
            allowNull: false
        },
        group_id:{
            type: DataTypes.INTEGER,
            references: {
                model: 'Group',
                key: 'id'
            },
            allowNull: false
        }
    },
    {
        paranoid:true,
        freezeTableName: true,
        timestamps:false
    }
    )
    return User_Group;
}