const expenseController = require("../controllers/expenseController.js");
const userAuthentication=require("../middleware/auth.js")
const router = require("express").Router();

router.post("/addExpense",userAuthentication.authenticate, expenseController.addExpense);
router.get("/getExpense",userAuthentication.authenticate, expenseController.getAllExpenses);
router.get("/download",userAuthentication.authenticate,expenseController.downloadExpenses)
router.delete("/:id", expenseController.deleteExpense)

module.exports = router;
