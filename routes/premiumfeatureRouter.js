
const userAuthentication=require("../middleware/auth.js")
const premiumfeatureController=require("../controllers/premiumFeatureController.js")
const router = require("express").Router();

router.get("/showleaderboard",userAuthentication.authenticate,premiumfeatureController.getUserLeaderBoard)

module.exports=router