// const LocalStrategy = require('passport-local').Strategy;
// const passport = require('passport');
// const bcrypt = require('bcrypt');
// const Users = require('../models/user1Model');
// const db = require('../models')
// const User = db.users

// User.select

// module.exports=function(passport){
// 	passport.use("local",new LocalStrategy(
//             function(username,password, done){
//                 Users.findOne({username:username}, (err, user) => {
//                     if(err){return done(err);}
//                     if(!user) {
//                         console.log('username is not found')
//                         return done(null, false)
                        
//                     }
//                     bcrypt.compare(password, user.password,(err, isValid) => {
//                         if(err){
//                             return done(err)
//                             conso
//                         }
//                         if(!isValid){
//                             console.log('password dosen match')
//                             return done(null, false)
//                         }
//                         return done(null,user)
//                     })
//                 })
//             }
//         ))
// 		passport.use('user',new LocalStrategy(
//             function(username,password, done){
//                 User.findOne({where:{username:username}}, (err, user) => {
//                     if(err){return done(err);}
//                     if(!user) {
//                         console.log('username is not found')
//                         return done(null, false)
                        
//                     }
//                     bcrypt.compare(password, user.password,(err, isValid) => {
//                         if(err){
//                             return done(err)
//                             conso
//                         }
//                         if(!isValid){
//                             console.log('password dosen match')
//                             return done(null, false)
//                         }
//                         return done(null,user)
//                     })
//                 })
//             }
//         ))

// 	passport.serializeUser(function(user, done) {
// 	    if(Users(user)) {
// 		    done(null, user.id);
// 	    }else if(User(user)){
// 		    done(null, user.id);
// 	    }
// 	});

// 	passport.deserializeUser(function(id, done) {
// 	    Users.findByUsername(username, function(err, admin) {
// 	        if (err) return done(err);
// 	        if (admin) return done(null, admin);
// 	    User.findByUsername(username, function(err, user) {
// 	            done(err, user);
// 	        });
// 	    });
// 	});
// }