module.exports = {
    HOST:'localhost',
    USER:'root',
    PASSWORD:'',
    DB:'curd2',
    dialect:'mysql',

    pool:{
        max:5,
        min:0,
        accquire:3000,
        idle:10000
    }
}