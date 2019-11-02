var DataTypes = require('sequelize/lib/data-types')

module.exports=(sequelize,Datatypes) =>{
    const Group = sequelize.define('group',{
        id:{
            type:Datatypes.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
        name: {
            type: Datatypes.STRING,
            allowNull: true,
        },
    },
    {
        paranoid:true,
        timestamps:false,
        freezeTableName: true
    }
    )
    return Group;
}