const db = require('../models')
const fs = require('fs')
const bcrypt = require('bcrypt')
const Users = require('../models/user1Model')
const multer = require('multer')
const path = require('path')
const {check, validationResult} = require('express-validator')
const { body } = require('express-validator/check')
const passport = require('passport')
const res = require('express/lib/response')
const { error } = require('console')
const { doesNotMatch } = require('assert')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
const LocalStrategy = require('passport-local').Strategy
const { nextTick, getMaxListeners } = require('process')
const nodemailer = require('nodemailer')
const moment = require('moment')
const XLSX = require('xlsx')
const excel = require("exceljs")
const readXlsxFile = require("read-excel-file");
const userservice = require("../services/user_services")
const pdf = require('dynamic-html-pdf')
moment.suppressDeprecationWarnings = true;

//create main model
const User = db.users

User.select

//mail
var transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'mayankshahu999@gmail.com',
        pass:'sgolnxhwituglayf'
    }
})

//image upload
var storage = multer.diskStorage({
    destination:"./uploads",
    filename:(req,file,cb) => {
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
})

var upload = multer({
    storage:storage
}).single('image')

// function getcookie(req) {
//     var cookie = req.headers.cookie;
//     return cookie.split(';');
// }



//post api for register

const addUser = async (req,res) => {
    var cookie = req.cookies.toggle;
    console.log(cookie)
    
    if(cookie == "true"){
        const {firstname,Lastname,username,email,mobileno,dob,startdate,attendance,status,hobby} = req.body;
        // const image = req.file.filename;
        let image = '';
        if(req.file){
            image = req.file.filename
        }
        const adduser = new Users({
        firstname,
        Lastname,
        username,
        email,
        mobileno, 
        dob,
        startdate,
        attendance,
        status,
        hobby,
        image
        });

        var form = {
            
            firstnameholder : req.body.firstname,
            Lastnameholder: req.body.Lastname,
            usernameholder : req.body. username,
            emailholder : req.body.email,
            mobilenoholder: req.body.mobileno,
            dobholder:req.body.dob,
            startdateholder:req.body.startdate,
            imageholder:req.body.image,
            hobbyholder:req.body.hobby,
        }
        // console.log(form)
        var errors = [];
        
        req.checkBody('image').custom((value) => {
            if(!req.file){
                return false
            }else{
                return true
            }
            
        }).withMessage('image is required')
        req.checkBody('firstname', 'First name is required').notEmpty();
        req.checkBody('mobileno','Enter a valid mobile no').isNumeric().isLength({min:10,max:10}).notEmpty();
        req.checkBody('Lastname', 'Last name is required').notEmpty();
        req.checkBody('username','username is required').notEmpty().custom(value => {
            return  Users.findOne({
                username: value
            }).then(user => {
                if(user){

                    throw new errors('Username alredy in use')
                }
                
            })
        }).withMessage('username alredy in use')
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        req.checkBody('startdate', 'startdate should be after dob').isAfter(dob)
        req.checkBody('hobby', 'plz select hobby').notEmpty()
        
        
        

        errors = req.validationErrors();
        // console.log(errors)
        
        let newObj = {};
        if(errors.length){
            errors.forEach((obj)=>{
                newObj[obj.param] = obj.msg;
            })

        }
        // console.log(newObj)
        

        if(errors){
            return res.render('first',{ error:errors, newError: newObj, forms: form, images: image});
            // return res.render('first',{error: errors});
        }

       
        
    
        adduser.save().then(() => {
            req.flash('success', 'you have register')
            req.session.save(function(){
                res.redirect('/addUser')
            })
            
            var mailOptions = {
                from:'mayankshahu999@gmail.com',
                to: req.body.email,
                subject:'sending loging detail',
                text: username
            }
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log('mail not sent')
                }else{
                    consoel.log('mail sent')
                }
            })
        }).catch(() => {
            req.flash('errors', 'username already taken')
            req.session.save(function() {
                res.redirect('/addUser')
            })
        })
        // res.send(adduser)
        console.log(addUser)
        
        // res.redirect('/')
    return;
    }
    else{
        let image = ''
        if(req.file){
            image = req.file.filename
        }
        
        let info = {
            firstname: req.body.firstname,
            Lastname: req.body.Lastname,
            username:req.body.username,
            email:req.body.email,
            mobileno:req.body.mobileno,
            dob:req.body.dob,
            startdate:req.body.startdate,
            attendance:req.body.attendance,
            status:req.body.status,
            hobby:req.body.hobby,
            image
            
        }
        var form = {
            
            firstnameholder : req.body.firstname,
            Lastnameholder: req.body.Lastname,
            usernameholder : req.body. username,
            emailholder : req.body.email,
            mobilenoholder: req.body.mobileno,
            dobholder:req.body.dob,
            startdateholder:req.body.startdate,
            hobbyholder:req.body.hobby,
        }
        req.checkBody('image').custom((value) => {
            if(!req.file){
                return false
            }else{
                return true
            }
            
        }).withMessage('image is required')
        req.checkBody('firstname','firstname field is required').notEmpty();
        req.checkBody('Lastname', 'Lastname is required').notEmpty();
        req.checkBody('username','username is required').notEmpty().custom(value => {
            return  User.findOne({
                where:{username: value}
            }).then(user => {
                if(user){

                    throw new errors('Username alredy in use')
                }
                
            })
        })
        req.checkBody('mobileno','enter a valid mobileno').isNumeric().isLength({min:10,max:10}).notEmpty();
        req.checkBody('username','username required').notEmpty();
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        req.checkBody('startdate', 'startdate should be after dob').isAfter(req.body.dob)
    

        const errors = req.validationErrors();
        console.log(errors)

        let newObj = {};
        if(errors.length){
            errors.forEach((obj)=>{
                newObj[obj.param] = obj.msg;
            })

        }

        if(errors){
            return res.render('first',{error: errors, newError: newObj, forms:form});
        }  
    
        const user = await User.create(info).then(() => {
            req.flash('success', 'you have register')
            req.session.save(function(){
                 res.redirect('/addUser')
            }) 
           
        }).catch(() => {
            req.flash('errors', 'something went wrong')
            req.session.save(function() {
                 res.redirect('/addUser')
            })
        })
        // res.status(200).send(user)
        
        // res.redirect('/')
    }


    


}

//view file show api

const getdata = async (req,res) => {
    
    // console.log(req.body.hidden)
    // if(req.body.hidden == 0){
       
        // let product = await User.findAll({
        
        // })
        // res.send(product)
        // console.log(product)
        res.render('view', {cookie:req.headers.cookie, success: req.flash('success'),})
        
    // }
    // else{
       
    //     let product = await Users.find({

    //     })
    //     res.status(200).send('view',{users:product})
    // }
}


//get api

const viewdata = async (req,res) => {
    var cookie = req.cookies.toggle
    // console.log(cookie)
    if(cookie == "true"){
        //  Users.find((err,agents) => {
        //     // const data = {agents};
        //     // console.log(data);
        //     res.send({users:agents})
        // })
        // res.send({users:data})
         Users.find().sort({_id:-1}).exec(function(err,agents){
            res.send({users:agents})
        })
    }
    else{
        let data = await User.findAll({
            order:[
                ['id', 'DESC']
            ]
        })
        // console.log(data)
        res.send({users:data})
    }
    
}

// const viewdata = async(req,res) => {
//     var cookie = req.cookies.toggle
//     // console.log(cookie)
//     if(cookie == "true"){
//         let {employeeData, employeeCount} = await userservice.getEmployeeFilteredData(req);
//         var response = {
//             "draw": parseInt(req.query.draw),
//             "iTotalRecords": employeeData.length,
//             "iTotalDisplayRecords": employeeCount[0].count,
//             "data": employeeData
//         }
//         res.status(200).send(response);
//     }
// }

//1.create user 

// const addUser = async (req,res) => {
    
//     console.log(req.body)
//     let info = {
//         firstname: req.body.firstname,
//         Lastname: req.body.Lastname
//     }

//     const user = await User.create(info)
//     res.status(200).send(user)


// }

// const addUser1 = async (req,res) => {
//     console.log(req.body)
//     const {firstname,Lastname} = req.body;
//     const adduser = new Users({
//         firstname,
//         Lastname
//     });
//     adduser.save()
//     res.send(adduser)
// }

const deleteuser = async (req,res) => {
    var cookie = req.cookies.toggle
    console.log(cookie)
    if(cookie == "true"){
        await Users.findOneAndRemove({username:req.params.username}).then(() => {
            req.flash('success', 'deleted succesfully')
            req.session.save(function(){
                res.redirect('/')
            })
        }).catch(() => {
            req.flash('errors', 'not deletd')
            req.session.save(function(){
                res.redirect('/')
            })
        })
        // res.redirect('/')
        console.log('deleted succesfully from mongodb')
        return;
    }else{
        let username = req.params.username
        await User.destroy({where:{username:username}}).then(() => {
            req.flash('success', 'deleted succesfully')
            req.session.save(function(){
                res.redirect('/')
            })
        }).catch(() => {
            req.flash('errors', 'not deletd')
            req.session.save(function(){
                res.redirect('/')
            })
        })
    }
    // res.redirect('/')
    // console.log('deleted user from sql')
}

const edituser = async (req,res) => {
    var cookie = req.cookies.toggle
    console.log(cookie)
    if(cookie == "true"){
        // const docs = await Users.findOne({username:req.params.username}, req.body, {new:true})
        const docs = await getUsers(req.params.username);
        console.log(docs)
        var newdob = moment(docs.dob,"dd/mm/YY hh:mm").format("YYYY-MM-DD")
        var newstartdate = moment(docs.startdate ,"dd/mm/YY hh:mm").format("YYYY-MM-DD")
        // console.log(newstartdate)
        
        res.render('edit',{users:docs, newdob:newdob, newstartdate:newstartdate})
        
    }else{
        let username = req.params.username
        let docs = await User.findOne({where:{username:username}})
        console.log('docs sql',docs)
        console.log(username, 'sql')
        var newdob = docs.dob;
        var newstartdate = docs.startdate;
        res.render('edit',{users:docs, newdob:newdob, newstartdate:newstartdate})
    }
}

//common function for getuser data in update form
async function getUsers(username){
    return await Users.findOne({username});
}
const updateuser = async (req,res) => {
    var cookie = req.cookies.toggle
    console.log(cookie)
    if(cookie == "true"){
         let username = req.params.username;
         let new_image = '';

        if(req.file){
            new_image = req.file.filename;
            try{
                fs.unlinkSync('./uploads/' + req.body.old_image);
            }catch(err){
                console.log(err)
            }
        }else{
            new_image = req.body.old_image;
        }
        
        
        //  if(req.body.password){
        //     req.body.password = await bcrypt.hash(req.body.password, 10)
        //  }
       
         Users.updateOne({username},{
            image:new_image,
            firstname:req.body.firstname,
            Lastname:req.body.Lastname,
            username:req.body.username,
            email:req.body.email,
            mobileno:req.body.mobileno,
            // password:req.body.password,
            dob:req.body.dob,
            startdate:req.body.startdate,
            attendance:req.body.attendance,
            status:req.body.status,
            hobby:req.body.hobby,
            
        },async (err,docs) => {
            if(err){
                console.log(err)
                // res.json({message:err.message, type:'danger'});
                
            }else{
                req.checkBody('firstname', 'First name is required').notEmpty();
                req.checkBody('Lastname', 'Lastname is required').notEmpty();
                req.checkBody('username','username is required').notEmpty();
                req.checkBody('mobileno','enter a valid mobileno').isNumeric().isLength({min:10,max:10}).notEmpty();
                req.checkBody('password','password is required').notEmpty();
                req.checkBody('email', 'Invalid email').notEmpty().isEmail();

                const errors = req.validationErrors();
                // console.log(errors)
        
                let newObj = {};
                if(errors.length){
                    errors.forEach((obj)=>{
                        newObj[obj.param] = obj.msg;
                    })

                }
                // console.log(newObj)
        

                if(errors){
                    console.log(errors)
                    const docs = await getUsers(req.params.username);
                     var newdob = moment(docs.dob,"dd/mm/YY hh:mm").format("YYYY-MM-DD")
                    var newstartdate = moment(docs.startdate ,"dd/mm/YY hh:mm").format("YYYY-MM-DD")
                    return res.render('edit',{ newError: newObj, users: docs, newdob:newdob, newstartdate:newstartdate});
            // return res.render('first',{error: errors});
                }

                res.redirect('/')
            }
            
        })
       
        // res.redirect('/')
    }else{
        let username = req.params.username
        let new_image = '';

        if(req.file){
            new_image = req.file.filename;
            try{
                // fs.unlinkSync('./uploads/' + req.body.old_image);
            }catch(err){
                console.log(err)
            }
        }else{
            new_image = req.body.old_image;
        }

        req.body.password = await bcrypt.hash(req.body.password, 10)

        req.checkBody('firstname', 'First name is required').notEmpty();
        req.checkBody('Lastname', 'Lastname is required').notEmpty();
        req.checkBody('username','username is required').notEmpty();
        req.checkBody('mobileno','enter a valid mobileno').isNumeric().isLength({min:10,max:10}).notEmpty();
        req.checkBody('password','password is required').notEmpty();
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();

        const errors = req.validationErrors();
        // console.log(errors)

        let newObj = {};
        if(errors.length){
            errors.forEach((obj)=>{
                newObj[obj.param] = obj.msg;
            })

        }
        // console.log(newObj)


        if(errors){
            // console.log(errors)
            let docs = await User.findOne({where:{username:username}})
            // console.log(docs)
            var newdob = req.body.dob;
            var newstartdate = req.body.startdate;
            return res.render('edit',{newError:newObj, users:docs, newdob:newdob, newstartdate:newstartdate})
    // return res.render('first',{error: errors});
        }else{

            await User.update({
               image:new_image,
               firstname:req.body.firstname,
               Lastname:req.body.Lastname,
               username:req.body.username,
               email:req.body.email,
               mobileno:req.body.mobileno,
            //    password:req.body.password,
               dob:req.body.dob,
               startdate:req.body.startdate,
               attendance:req.body.attendance,
               status:req.body.status,
               hobby:req.body.hobby,
               
           },{where:{username:username}}).then(userUpdateData => {
               console.log(1);
               bcrypt.genSalt(10, (err,salt) => {
                   bcrypt.hash(userUpdateData.password, salt, async (err,hash) => {
                       if(err){
                           console.log('err in update')
                       }else{
                           userUpdateData.password = hash;
                           userUpdateData.save()
                           
                          
                           
    
                       }
                   })
               })
           })
        }

       res.redirect('/')
    }
    // res.redirect('/')
}

const loginuser = async(req, res) => {
    var cookie = req.cookies.toggle
    console.log(cookie)
    if(cookie == "true"){
         const user = Users.findOne({username: req.body.username},async function(err, user){
            console.log('user found')
            try{
                if(await bcrypt.compare(req.body.password, user.password)){
                    // res.redirect('/')
                    req.flash('successs', 'suceesfull login')
                    req.session.save(function(){
                        res.redirect('/')
                    })
                }else{
                    // console.log('wrong password')
                    // res.redirect('/login')
                    req.flash('succes', 'Wrong password')
                    req.session.save(function(){
                        res.redirect('/login')
                    })
                } 
            }catch{
                // console.log('wrong user')
                // res.redirect('/login')
                req.flash('success', 'Username not found')
                    req.session.save(function(){
                        res.redirect('/login')
                    })
            }
        })
    }else{
        User.findOne({where:{username: req.body.username}}).then(async (user) => {
            if(user){
               if(await bcrypt.compare(req.body.password, user.password)){
                console.log('password  match')
                res.redirect('/')
               }else{
                //    console.log('pass dosent match')
                //    res.redirect('/login')
                   req.flash('succes', 'Wrong password')
                   req.session.save(function(){
                       res.redirect('/login')
                   })
                   
               }
            }
            else{
                // console.log('username not found')
                // res.redirect('/login')
                req.flash('success', 'Username not found')
                    req.session.save(function(){
                        res.redirect('/login')
                    })
            }
        })
    }
}


    passport.use('local', new LocalStrategy({usernameField:'username', passwordField:'password',passReqToCallback: true},(req,username,password,done) => {
        Users.findOne({
            username:username
        }).then(users => {
            if(!users){
                
                console.log('users data not match')
                return done(null,false, req.flash('success', 'User not found'))
            }
            bcrypt.compare(password, users.password, (err, isMatch) => {
                if(err){
                    console.log(err)
                }
                if(isMatch){
                    console.log('succesfully login')
                    
                    return done(null,users)
                    
                }else{
                    
                    console.log('password not match')
                    return done(null,false, req.flash('succes', 'Password not match'))
                }
            });
        });

    }));

    passport.use('local-sql', new LocalStrategy({usernameField:'username', passwordField:'password',passReqToCallback: true},(req,username,password,done) => {
        User.findOne({where:{
            username:username
        }}).then(users => {
            if(!users){
                console.log('users data not match')
                return done(null,false, req.flash('success', 'User not found'))
            }
            bcrypt.compare(password, users.password, (err, isMatch) => {
                if(err){
                    console.log(err)
                    return done(null,false)
                }
                if(isMatch){
                    console.log('succesfully login')
                    return done(null,users)
                    
                }else{
                    console.log('password not match')
                    return done(null,false, req.flash('succes', 'Password not match'))
                }
            });
        });

    }));

    // passport.serializeUser(Users.serializeUser());
    // passport.deserializeUser(Users.deserializeUser());


const passlogin = async(req,res, next) => {
    var cookie = req.cookies.toggle
    console.log(cookie)
    if(cookie == "true"){
        passport.serializeUser(Users.serializeUser());
        passport.deserializeUser(Users.deserializeUser());

        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true,
            // req.flash('succes', 'Wrong password')
            //         req.session.save(function(){
            //             res.redirect('/login')
            //         })
        })(req, res, next);
    }else{
        passport.serializeUser(function(users, done) {
            done(null, users.username);
        });
        passport.deserializeUser(async(users, done)=>{
            try {
                const user = await User.findOne({users:users});
                done(null, user);
                
            } catch (error) {
                console.log(error);
            }
        });

        passport.authenticate('local-sql', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true,
        })(req, res, next);
    }
}

const alldata = async(req,res) => {
    var cookie = req.cookies.toggle
    console.log(cookie)
    if(cookie == "true"){
         await Users.find().sort({_id:-1}).then((objs) => {
             let tutorials = [];
            objs.forEach((obj) => {
                tutorials.push({
                    image: obj.image,
                    firstname: obj.firstname,
                    Lastname: obj.Lastname,
                    Username: obj.username,
                    email: obj.email,
                    mobileno: obj.mobileno,
                    dob: obj.dob,
                    startdate: obj.startdate,
                    attendance: obj.attendance,
                    status: obj.status,
                    hobby: obj.hobby,


                });
            });
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Tutorials");
            worksheet.columns = [
                { header: "Image", key: "image", width: 10 },
                { header: "Firstname", key: "firstname", width: 10 },
                { header: "Lastname", key: "Lastname", width: 10 },
                { header: "Username", key: "Username", width: 10 },
                { header: "Email", key: "email", width: 10 },
                { header: "Mobileno", key: "mobileno", width: 10 },
                { header: "Dob", key: "dob", width: 10 },
                { header: "Startdate", key: "startdate", width: 10 },
                { header: "Attendance", key: "attendance", width: 10 },
                { header: "Status", key: "status", width: 10 },
                { header: "Hobby", key: "hobby", width: 10 },
            ];
            worksheet.addRows(tutorials);
            res.setHeader(
                "content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "tutorials.xlsx"
            );
            return workbook.xlsx.write(res).then(function(){
                res.status(200).end();
            })
         })
            
        
        
    }else{
        await User.findAll({
            order:[
                ['id', 'DESC']
            ]
        }).then((objs) => {
            let tutorials = [];
           objs.forEach((obj) => {
               tutorials.push({
                   image: obj.image,
                   firstname: obj.firstname,
                   Lastname: obj.Lastname,
                   Username: obj.username,
                   email: obj.email,
                   mobileno: obj.mobileno,
                   dob: obj.dob,
                   startdate: obj.startdate,
                   attendance: obj.attendance,
                   status: obj.status,
                   hobby: obj.hobby,


               });
           });
           let workbook = new excel.Workbook();
           let worksheet = workbook.addWorksheet("Tutorials");
           worksheet.columns = [
                { header: "Image", key: "image", width: 10 },
               { header: "Firstname", key: "firstname", width: 10 },
               { header: "Lastname", key: "Lastname", width: 10 },
               { header: "Username", key: "Username", width: 10 },
               { header: "Email", key: "email", width: 10 },
               { header: "Mobileno", key: "mobileno", width: 10 },
               { header: "Dob", key: "dob", width: 10 },
               { header: "Startdate", key: "startdate", width: 10 },
               { header: "Attendance", key: "attendance", width: 10 },
               { header: "Status", key: "status", width: 10 },
               { header: "Hobby", key: "hobby", width: 10 },
           ];
           worksheet.addRows(tutorials);
           res.setHeader(
               "content-Type",
               "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
           );
           res.setHeader(
               "Content-Disposition",
               "attachment; filename=" + "tutorials.xlsx"
           );
           return workbook.xlsx.write(res).then(function(){
               res.status(200).end();
           })
        })
    }
}



const storages = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './files')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now()  + path.extname(file.originalname))
    }
})

    var uploadFile = multer({storage:storages}).single("file")

const importdata = async (req,res) => {
    var cookie = req.cookies.toggle
    console.log(cookie)
    if(cookie == "true"){
        const wb = XLSX.readFile(req.file.path, {dateNF:"mm/dd/yyyy"});
        const sheets = wb.SheetNames;

        if(sheets.length > 0){
            const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]], {header:1,raw:false});
            const movies = data.map(row => ({
                image:row[0],
                firstname: row[1],
                Lastname: row[2],
                username:row[3],
                email:row[4],
                mobileno:row[5],
                dob:row[6],
                startdate:row[7],
                attendance:row[8],
                status:row[9],
                hobby:row[10],
                password:row[11]




            }))
            // var a =  movies.map(value => value.dob)
            // console.log(a , ":a");
            console.log(movies)
            await Users.insertMany(movies)
            return res.redirect('/')
        }
    }else{
        const wb = XLSX.readFile(req.file.path);
        const sheets = wb.SheetNames;

        if(sheets.length > 0){
            const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]], {header:1,raw:false});
            const movies = data.map(row => ({
                image:row[0],
                firstname: row[1],
                Lastname: row[2],
                username:row[3],
                email:row[4],
                mobileno:row[5],
                dob: row[6],
                startdate:row[7],
                attendance:row[8],
                status:row[9],
                hobby:row[10],
                password:row[11]




            }))
            console.log(movies )
            await User.bulkCreate(movies)
            return res.redirect('/')
        }
    }
}

const multipledelete = async ( req,res) => {
    var cookie = req.cookies.toggle
    console.log(cookie)
    if(cookie == "true"){
        console.log(req.body.special_id);
        const checkbox = req.body.special_id;
        const deletedUsers = await Users.deleteMany({username:{$in:checkbox}});

        var errors = ''
        if(!checkbox){
            errors = {checkbox : 'checkbox is not selected'}
        }

        console.log(errors)
    //    req.checkBody('checkbox','checkbox is not selected').notEmpty();

    //    const errors = req.validationErrors();
    //     console.log(errors)

    //     let newObj = {};
    //     if(errors.length){
    //         errors.forEach((obj)=>{
    //             newObj[obj.param] = obj.msg;
    //         })

    //     }
    //     console.log(newObj)

        if(errors){
            return res.render('view',{error: errors});
        } 

        
        
        // if(!deletedUsers){
        //     return false;
        // }
        // return true;

    }else{
        // console.log(req.body.special_id);
        await User.destroy({ where: { username: [req.body.special_id] }}).then((suc) => {
            // console.log(suc)
            return res.redirect('/')
        })
    }

    // return res.redirect('/addUser')
}

vehicle_search = "";
const createpdf = async(req,res) => {
    var cookie = req.cookies.toggle
    console.log(cookie)
    if(cookie == "true"){
        var filename = "./users"+Date.now()+".pdf";
	const pdf_html_file = fs.readFileSync('views/pdf.ejs', 'utf8');
	await Users.find().sort({_id:-1}).lean().exec(function(err,vendors){
		// console.log(vendors)

        if(vendors){
            var newvendors = vendors.map(function(vendor){
                let formattedate =moment(vendor.dob,"dd/mm/YY hh:mm").format("YYYY-MM-DD")
                let formattedate2 = moment(vendor.startdate,"dd/mm/YY hh:mm").format("YYYY-MM-DD")
                vendor.dob = formattedate;
                vendor.startdate = formattedate2;
                
            })
            
            console.log(newvendors)
        }
		// vendors.forEach((val,key) =>{
        //     val.name = ucfirst(val.name);
        //     if(val.in_society == '1'){
        //     	val.in_society = ucfirst('yes');
        //     }else{
        //     	val.in_society = ucfirst('no');
        //     }
        // });


	 	var options = {
		    format: "A3",
		    orientation: "portrait",
		    border: "10mm",
            
            
            
           
		};
		var document = {
		    template: pdf_html_file,
		    context: {
		        vendors
		    },
		    path: filename
		};
		pdf.create(document, options)
	    .then(render => {
	        res.download(filename);
	    })
	    .catch(error => {
	        console.error(error)
    	});
		setTimeout(function(){
			fs.unlink(filename, (res,error) => { /*console.log(error);*/ });
		},10000);
	});
    }else{
        var filename = "./users"+Date.now()+".pdf";
	const pdf_html_file = fs.readFileSync('views/pdf.ejs', 'utf8');
	await User.findAll({order:[
        ['id', 'DESC']
    ],raw: true,}).then((vendors) => {
		console.log(vendors)
		
	 	var options = {
		    format: "A3",
		    orientation: "portrait",
		    border: "10mm"
		};
		var document = {
		    template: pdf_html_file,
		    context: {
		        vendors
		    },
		    path: filename
		};
        // const file = {url}
		pdf.create(document, options)
	    .then(render => {
	        res.download(filename);
	    })
	    .catch(error => {
	        console.error(error)
    	});
		setTimeout(function(){
			fs.unlink(filename, (res,error) => { /*console.log(error);*/ });
		},10000);
	});
    }
}



module.exports = {
    addUser,
    upload,
    // addUser1,
    getdata,
    viewdata,
    deleteuser,
    edituser,
    updateuser,
    loginuser,
    passlogin,
    alldata,
    importdata,
    uploadFile,
    multipledelete,
    createpdf
   
}