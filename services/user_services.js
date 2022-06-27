const sequelize = require('sequelize');
const Op = sequelize.Op;
const db = require('../models')

const User = db.users

User.select
const sequelizeDatatable = require('node-sequelize-datatable')
const Users = require('../models/user1Model')

let vehicle_search = "";

exports.getEmployeeFilteredData = async (req,res) => {
    var cookie = req.cookies.toggle
    console.log(cookie)
    if(cookie == "true"){

        var columns = ['image','firstname','Lastname','username','email','mobileno', 'dob', 'startdate','attendance','status','hobby'];
        var searchStr  = req.body.search.value;
        // console.log(req.body.search.value);
        // console.log(req.body.from_date);
        // console.log(req.body.to_date)
        var sortingColumn = req.body.order[0].column;
    
        var columnsData =req.body.columns[sortingColumn].data;
        var sortingType = req.body.order[0].dir;
        var sortJson = {};
        if(sortingType == 'desc'){
    
            sortJson[columns[sortingColumn]] = -1
        }else{
            sortJson[columns[sortingColumn]] = 1;
        }
        if(req.body.search.value != ''){
            var regex = new RegExp('^' + req.body.search.value,'i')
            searchStr = { $or: [
                            {'firstname':regex},
                            // {'Lastname':regex},
                            {'username':regex},
                            {'email':regex},
                            {'attendance':regex},
                            {'status':regex},
                            {'hobby':regex},
                            {'mobileno':regex},
                            
                            ]
                        };
        }else if(req.body.columns[2].search.value != ''){
            var regex = new RegExp('^' + req.body.columns[2].search.value,'i')
            searchStr = { $or: [
                            {'firstname':regex}
                            ]
                        };
        }else if(req.body.columns[3].search.value != ''){
            var regex = new RegExp('^' +req.body.columns[3].search.value,'i')
            searchStr = { $or: [
                            {'username':regex}
                            ]
                        };
        }else if(req.body.columns[4].search.value != ''){
            var regex = new RegExp('^' +req.body.columns[4].search.value,'i')
            searchStr = { $or: [
                            {'email':regex}
                            ]
                        };
        }else if(req.body.columns[5].search.value != ''){
            var regex = new RegExp('^' +req.body.columns[5].search.value,'i')
            searchStr = { $or: [
                            {'mobileno':regex}
                            ]
                        };
        }else{
            searchStr = {};
        }
    
        vehicle_search = searchStr;
        // console.log(searchStr)
        
    
        var recordsTotal = 0;
        var recordsFiltered=0;

        if(!req.body.from_date){
            Users.countDocuments({},function(err,c){
                recordsTotal = c;
                Users.countDocuments(searchStr,function(err,c){
                    // console.log(c)
                    recordsFiltered = c;
                    
                    Users.find(searchStr,columns,{'skip': Number( req.body.start),'limit': Number(req.body.length)}).sort(sortJson).exec(function(err,result){
        
                        if(err){
                            console.log('error while getting result'+err)
                            return;
                        }
                        var data = JSON.stringify({
                            draw : req.body.draw,
                            recordsFiltered : recordsFiltered,
                            recordsTotal : recordsTotal,
                            data : result,
                        });
                        // console.log(data)
                        res.send(data);
                    })
                });
            });
        }else{
            Users.countDocuments({startdate:{$gte:req.body.from_date, $lte:req.body.to_date }},function(err,c){
                recordsTotal = c;
                // console.log(c)
                // Users.countDocuments( { startdate:{$gte:req.body.from_date, $lte:req.body.to_date }},function(err,c){
                //     console.log(c)
                //     recordsFiltered = c;
                Users.find(searchStr).count({startdate:{$gte:req.body.from_date, $lte:req.body.to_date }}, function(err,c){
                    console.log(c)
                    recordsFiltered = c;
                    // console.log(req.body.start)
                    // console.log(req.body.length)
                    if(!req.body.search.value){
                        
                        Users.find({startdate:{$gte:req.body.from_date, $lte:req.body.to_date },'skip': Number( req.body.start),'limit': Number(req.body.length)}).sort(sortJson).exec(function(err,result){
                            console.log(result)
                            if(err){
                                console.log('error while getting result'+err)
                                return;
                            }
                            var data = JSON.stringify({
                                draw : req.body.draw,
                                recordsFiltered : recordsFiltered,
                                recordsTotal : recordsTotal,
                                data : result,
                            });
                            // console.log(data)
                            res.send(data);
                        })
                    
                    }else{
                        
                            Users.find(searchStr,columns,{'skip': Number( req.body.start),'limit': Number(req.body.length)}).sort(sortJson).exec(function(err,result){
        
                            if(err){
                                console.log('error while getting result'+err)
                                return;
                            }
                            var data = JSON.stringify({
                                draw : req.body.draw,
                                recordsFiltered : recordsFiltered,
                                recordsTotal : recordsTotal,
                                data : result,
                            });
                            // console.log(data)
                            res.send(data);
                        })
                        
                    }
                });
            });
        }
    
            // Users.countDocuments({},function(err,c){
            // recordsTotal = c;
            // Users.countDocuments(searchStr,function(err,c){
            //     // console.log(c)
            //     recordsFiltered = c;
                
            //     Users.find(searchStr,columns,{'skip': Number( req.body.start),'limit': Number(req.body.length)}).sort(sortJson).exec(function(err,result){
    
            //         if(err){
            //             console.log('error while getting result'+err)
            //             return;
            //         }
            //         var data = JSON.stringify({
            //             draw : req.body.draw,
            //             recordsFiltered : recordsFiltered,
            //             recordsTotal : recordsTotal,
            //             data : result,
            //         });
            //         // console.log(data)
            //         res.send(data);
            //     })
            // });
        // });
    }else{
        var columns = ['image','firstname','Lastname','username','email','mobileno', 'dob', 'startdate','attendance','status','hobby'];
        var searchStr  = req.body.search.value;
        var sortingColumn = req.body.order[0].column;
    
        var columnsData =req.body.columns[sortingColumn].data;
        var sortingType = req.body.order[0].dir;
        var sortJson = {};
        if(sortingType == 'desc'){
    
            sortJson[columns[sortingColumn]] = -1
        }else{
            sortJson[columns[sortingColumn]] = 1;
        }
        if(req.body.search.value != ''){
            // var regex = new RegExp(req.body.search.value,'i')
             
             console.log(regex);
            console.log(req.body.search.value)
            searchStr = {[Op.or] :[{firstname:{[Op.like]:`%${req.body.search.value}%`}},
                        {username:{[Op.like]:`%${req.body.search.value}%`}},
                        {email:{[Op.like]:`%${ req.body.search.value}%`}},
                        {mobileno:{[Op.like]:`%${ req.body.search.value}%`}},
                        {attendance:{[Op.like]:`%${ req.body.search.value}%`}},
                        {status:{[Op.like]:`%${ req.body.search.value}%`}},
                        {hobby:{[Op.like]:`%${ req.body.search.value}%`}}
                        ]};
        }else if(req.body.columns[2].search.value != ''){
            var regex = new RegExp(req.body.columns[2].search.value,'i')
            
            searchStr = {firstname:{[Op.like]:`%${req.body.columns[2].search.value}%`}};
        }else if(req.body.columns[3].search.value != ''){
            // console.log(req.body.columns[2].search.value)
            var regex = new RegExp(req.body.columns[3].search.value,'i')
            searchStr = {username:{[Op.like]:`%${req.body.columns[3].search.value}%`}};
        }else if(req.body.columns[4].search.value != ''){
            var regex = new RegExp(req.body.columns[4].search.value,'i')
            searchStr = {email:{[Op.like]:`%${req.body.columns[4].search.value}%`}};
        }else if(req.body.columns[5].search.value != ''){
            var regex = new RegExp(req.body.columns[5].search.value,'i')
            searchStr = {mobileno:{[Op.like]:`%${req.body.columns[5].search.value}%`}};
        }else{
            searchStr = {};
        }
    
        vehicle_search = searchStr;
        // console.log(searchStr)
        
    
        var recordsTotal = 0;
        var recordsFiltered=0;
        console.log(req.body.from_date);
        console.log(req.body.to_date);

        if(!req.body.from_date){
            let totalData = await User.count({})
            // console.log(totalData)
            // console.log("1")
            
           
            let filters = await User.findAndCountAll({where:searchStr , offset: Number( req.body.start) ,limit: Number(req.body.length),order:[
                ['id', 'DESC']
            ]}).then((result) => {
                var data = JSON.stringify({
                    draw : req.body.draw,
                    recordsFiltered :result.count,
                    recordsTotal : totalData,
                    data : result.rows,
                });
                res.send(data)
            })
        }else{
            let totalData = await User.count({where:{startdate:{[Op.between]:[req.body.from_date, req.body.to_date]}}})
            // console.log(totalData)
            // console.log("1")
            
           
            let filters = await  User.findAndCountAll({where:[{startdate:{[Op.between]:[req.body.from_date, req.body.to_date]}}, searchStr]})
            .then((result) => {
                var data = JSON.stringify({
                    draw : req.body.draw,
                    recordsFiltered :result.count,
                    recordsTotal : totalData,
                    data : result.rows,
                });
                res.send(data)
            })
        }

      

        // let test = await  User.findAndCountAll({where:{startdate:{[Op.between]:[req.body.from_date, req.body.to_date]}}})
        // console.log(test.rows)

        // let totalData = await User.count({})
        // // console.log(totalData)
        // // console.log("1")
        
       
        // let filters = await User.findAndCountAll({where:searchStr , offset: Number( req.body.start) ,limit: Number(req.body.length),order:[
        //     ['id', 'DESC']
        // ]}).then((result) => {
        //     var data = JSON.stringify({
        //         draw : req.body.draw,
        //         recordsFiltered :result.count,
        //         recordsTotal : totalData,
        //         data : result.rows,
        //     });
        //     res.send(data)
        // })
    }
        // console.log(filters.rows)

        // let filter = await User.count(searchStr)
        
        // console.log(filter)
        // console.log('2')
    
            // await User.count({ distinct: true,
            // },async function(err,c){
            // recordsTotal = c;
            // console.log("1")
            // User.count(searchStr,async function(err,c){
                // recordsFiltered = c;
                
                // User.find(searchStr,columns,{'skip': Number( req.body.start),'limit': Number(req.body.length)}).sort({_id:-1}).exec(function(err,result){
                
            //     await User.findAll({offset: Number( req.body.start) ,limit: Number(req.body.length),order:[
            //         ['id', 'DESC']
            //     ]}).then((result) => {
                    
            //         var data = JSON.stringify({
            //                 draw : req.body.draw,
            //                 recordsFiltered :filters.count,
            //                 recordsTotal : totalData,
            //                 data : filters.rows,
            //             });
            //             res.send(data)
            //             // console.log(data);
            //     })
            // // })
            // }
                // console.log(dats)
    
                    // if(err){
                    //     console.log('error while getting result'+err)
                    //     return;
                    // }
                    // var data = JSON.stringify({
                    //     draw : req.body.draw,
                    //     recordsFiltered : recordsFiltered,
                    //     recordsTotal : recordsTotal,
                    //     data : result,
                    // });
                    // console.log(data)
                    // res.send(data);
        //         })
        //     });
        // // });
    // }
			
};