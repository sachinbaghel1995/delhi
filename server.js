const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

// var corOptions = {
//   origin: "https://localhost:8050"
// }

const dotenv = require("dotenv");

// get config vars
dotenv.config();

app.use(cors());
app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "hello" });
});
console.log("sachin");

const userRouter = require("./routes/userRouter.js");
app.use("/api/users", userRouter);

const expenseRouter = require("./routes/expenseRouter.js");
app.use("/api/expenses", expenseRouter);

const purchaseRouter = require("./routes/purchaseRouter.js");
app.use("/api/purchase", purchaseRouter);

const premiumfeatureRoutes = require("./routes/premiumfeatureRouter.js");
app.use("/api/premium", premiumfeatureRoutes);

const resetpasswordRoutes = require("./routes/resetpasswordRouter.js");

const router = require("./routes/router.js");
app.use("/api/password", resetpasswordRoutes);
app.use(router);

const PORT = process.env.PORT || 8050;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
