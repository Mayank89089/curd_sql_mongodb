const express = require('express');
const router = express.Router()
const expressValidator = require('express-validator')
const path = require('path')
const userController = require('../controllers/userController')
const Users = require('../models/user1Model')
const passport = require('passport')
const bcrypt = require('bcrypt');
const { cookie } = require('express/lib/response');
const LocalStrategy = require('passport-local').Strategy
const userservice = require("../services/user_services")


const result = false;

router.get('/addUser', (req,res) => {
    res.render ('first',{
        success: req.flash('success'),
        errors: req.flash('errors')
    })
})

router.get('/addUser',(req,res) => {
    res.render('./partials/header')
})

// router.get('/', (req,res) => {
//     res.render('view')
// })


router.post('/addUser' ,userController.upload, userController.addUser)

router.get('/', userController.getdata);
router.post('/', userservice.getEmployeeFilteredData);


router.get('/delete/:username', userController.deleteuser)
router.post('/deletemany', userController.multipledelete)

router.get('/update/:username', userController.edituser)

router.post('/edit/:username',userController.upload, userController.updateuser)

router.get('/login',(req,res) => {
    res.render('login',{
        succes: req.flash('succes'),
        success: req.flash('success')
    })
})

router.get('/pdf', userController.createpdf)


// passport.use('users',new LocalStrategy(
//     function(username,password, done){
//         Users.findOne({username:username}, (err, user) => {
//             if(err){return done(err);}
//             if(!user) {
//                 console.log('username is not found')
//                 return done(null, false)
                
//             }
//             bcrypt.compare(password, user.password,(err, isValid) => {
//                 if(err){
//                     return done(err)
//                     conso
//                 }
//                 if(!isValid){
//                     console.log('password dosen match')
//                     return done(null, false)
//                 }
//                 return done(null,user)
//             })
//         })
//     }
// ))

// passport.serializeUser(Users.serializeUser());
// passport.deserializeUser(Users.deserializeUser());

// router.post('/login',(req,res) => { var cookie = req.cookies.toggle ;
// console.log(cookie)
// ,passport.authenticate('users', {failureRedirect:'/login'}), (req,res) => {
//     res.redirect('/')
// }
// })

router.post('/login',userController.passlogin)

router.get('/data', userController.alldata)
router.post('/import', userController.uploadFile, userController.importdata )

// router.post('/addUser1', userController.addUser1)

// if(result == true){
//     router.post('/addUser', userController.addUser1)
// }else{
//     router.post('/addUser', userController.addUser)
// }



module.exports = router