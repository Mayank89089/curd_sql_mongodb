const bcrypt = require('bcrypt')

module.exports = (sequelize,DataTypes) => {

    const user = sequelize.define("user",{
        firstname:{
            type:DataTypes.STRING
        },
        Lastname:{
            type:DataTypes.STRING
        },
        username:{
            type:DataTypes.STRING
        },
        email:{
            type:DataTypes.STRING
        },
        mobileno:{
            type:DataTypes.STRING
        },
        dob:{
            type:DataTypes.DATEONLY
        },
        startdate:{
            type:DataTypes.DATEONLY
        },
        attendance:{
            type:DataTypes.STRING
        },
        status:{
            type:DataTypes.STRING
        },
        hobby:{
            type:DataTypes.STRING
        },
        image:{
            type:DataTypes.STRING
        },
        password:{
            type:DataTypes.STRING,
            defaultValue: '123456'
        },
        

    },{
        hooks:{
            beforeCreate:async (user) => {
                if(user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt)
                }
            }
        }
    })
    return user;
}

