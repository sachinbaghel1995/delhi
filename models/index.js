const dbConfig=require('../config/dbConfig.js')

const {Sequelize,DataTypes}=require('sequelize')

const sequelize=new Sequelize(dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,{
        host:dbConfig.HOST,
        dialect:dbConfig.dialect,
        operatorsAliases:false,

        pool:{
            max:dbConfig.pool.max,
            min:dbConfig.pool.min,
            acquire:dbConfig.pool.acquire,
            idle:dbConfig.pool.idle
        }
 })

 sequelize.authenticate().then(()=>{
    console.log('connected')
 })
 .catch(err=>console.log(err))

 const db={}

 db.Sequelize=Sequelize
 db.sequelize=sequelize

 db.users=require('./userModel.js')(sequelize,DataTypes)
 db.expenses=require('./expenseModel.js')(sequelize,DataTypes)
 db.orders=require('./orderModel.js')(sequelize,DataTypes)
 db.resetpassword=require('./resetPasswordModel.js')(sequelize,DataTypes)
 db.sequelize.sync({force:true})
 .then(()=>{
    console.log('sync done')
 })

 db.users.hasMany(db.expenses)
 db.expenses.belongsTo(db.users)

 db.users.hasMany(db.orders)
 db.orders.belongsTo(db.users)


 db.users.hasMany(db.resetpassword)
 db.resetpassword.belongsTo(db.users)



 module.exports=db