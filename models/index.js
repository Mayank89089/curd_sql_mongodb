const dbconfig = require('../config/dbConfig');

const {Sequelize,DataTypes} = require('sequelize')

const sequelize = new Sequelize(
    dbconfig.DB,
    dbconfig.USER,
    dbconfig.PASSWORD,{
        host:dbconfig.HOST,
        dialect:dbconfig.dialect,

        pool:{
            max:dbconfig.pool.max,
            min:dbconfig.pool.min,
            accquire:dbconfig.pool.accquire,
            idle:dbconfig.pool.idle,
        }
    }

)

sequelize.authenticate()
.then(() => {
    console.log('connected')
}).catch(err => {
    console.log('error' + err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.sequelize.sync({force:false})
.then(() => {
    console.log('yes resync done!')
})

db.users = require('./userModel.js')(sequelize,DataTypes)

module.exports = db