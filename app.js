const express = require('express');
const app = express();
const path = require('path')
const expressLayouts = require("express-ejs-layouts")
const bodyparser = require('body-parser')
const ejs = require('ejs')
require('./models')
require('./config/dbConfig1')
const router = require('./routes/userRouter')
const expresValidator = require('express-validator')
const expressSession = require('express-session')
const flash = require('connect-flash');
const toastr = require('toastr')
const cookieParser = require('cookie-parser');
const passport = require('passport');




app.use(expressLayouts)
app.set('view engine','ejs')
app.set('layout','./layouts/full-width')
app.use(cookieParser());

app.use(expressSession({
    secret:'max',
    saveUninitialized:true,
    resave:false
}))

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());



app.use(flash());
app.use(expresValidator());
// app.use(expresvalidator({
//     errorFormatter: function(param, msg, value) {
//         var namespace = param.split('.')
//             , root    = namespace.shift()
//             , formParam = root;
 
//         while(namespace.length) {
//             formParam += '[' + namespace.shift() + ']';
//         }
//         return {
//             param : formParam,
//             msg   : msg,
//             value : value
//         };
//     }
// }));





//routes
app.use('/',router)
app.use('/addUser', router)

// app.get('/', (req,res) => {
//     res.sendFile(path.join(__dirname + '/views/view.ejs'))
// })

app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static('uploads'))







app.listen(9000, () => {
    console.log('listening on 9000')
})