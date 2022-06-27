const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/curd2')
.then(() => {console.log('connceted through mongodb')
}).catch((e) => {console.log(e)})