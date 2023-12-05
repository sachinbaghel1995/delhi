const router = require("express").Router()
const purchaseController=require("../controllers/purchaseController.js")
const authenticateMiddleware=require("../middleware/auth.js")


router.get('/premiummembership',authenticateMiddleware.authenticate,purchaseController.purchasepremium)

router.post('/updatetransactionstatus', authenticateMiddleware.authenticate, purchaseController.updateTransactionStatus)

module.exports = router;
