const { where } = require("sequelize");
const db = require("../models");

const Expense = db.expenses;
const User = db.users;
const sequelize=db.sequelize
// console.log(sequelize)
const getUserLeaderBoard=async (req,res)=>{
    try{
        const leaderboardofusers=await User.findAll({
           order:[['totalExpenses','DESC']]
        })
res.status(200).json(leaderboardofusers)

    }
    catch(err){
console.log(err)
res.status(500).json(err)
    }
}
// console.log(User)
module.exports={
    getUserLeaderBoard
}