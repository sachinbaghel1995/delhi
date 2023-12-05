const userController=require('../controllers/userController.js')
const router = require("express").Router()
const userAuthentication=require("../middleware/auth.js")
router.post("/adduser",userController.addUser)
router.post("/login",userController.login)
router.get('/user',userAuthentication.authenticate,userController.getUser)

module.exports = router