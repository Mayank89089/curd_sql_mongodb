const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = mongoose.Schema({
    firstname:{
        type:String
    },
    Lastname:{
        type:String
    },
    username:{
        type:String,
        unique : true,
    },
    email:{
        type:String
    },
    mobileno:{
        type:String
    },
    dob:{
        type:Date
    },
    startdate:{
        type:Date
    },
    attendance:{
        type:String,
        possibleValues:['present','notpresent']
    },
    status:{
        type:String,
        possibleValues:['married','unmarried']
    },
    hobby:{
        type:String
    },
    image:String,
    password:{
        type:String,
        default:'123456'
    }


})

userSchema.pre('save' , async function(next){
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    }catch(error){

    }
})

userSchema.plugin(passportLocalMongoose);


const User = mongoose.model('User',userSchema)

module.exports = User