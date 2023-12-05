const { where } = require("sequelize");
const db = require("../models");
const Expense = db.expenses;
const User = db.users;
const sequelize = db.sequelize;
const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
const addExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    let info = {
      id: req.body.id,
      expenseamount: req.body.expenseamount,
      category: req.body.category,
      description: req.body.description,
      userId: req.user.id,
    };
    const { expenseamount } = req.body;
    console.log(info.expenseamount);
    const expense = await Expense.create(info, { transaction: t });
    const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount);
    console.log(totalExpense);
    await User.update(
      {
        totalExpenses: totalExpense,
      },
      {
        where: { id: req.user.id },
        transaction: t,
      }
    );
    await t.commit();
    res.status(200).json({ expense: expense });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ success: false, error: err });
  }
};


const getAllExpenses = async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10; 

  const offset = (page - 1) * limit;

  try {
    const expenses = await Expense.findAndCountAll({
      where: { userId: req.user.id },
      limit: limit,
      offset: offset,
    });

    res.status(200).send(expenses);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const deleteExpense = async (req, res) => {
  let id = req.params.id;
  await Expense.destroy({ where: { id: id } });

  res.status(200).send("product deleted...");
};

const downloadExpenses = async (req, res) => {
  try {
    if (!req.user.ispremiumuser) {
      return res
        .status(401)
        .json({ success: false, message: "User is not a premium User" });
    }
    const AZURE_STORAGE_CONNECTION_STRING =
      process.env.AZURE_STORAGE_CONNECTION_STRING;

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );

    const containerName = "baghelsachin1995"; 

    console.log("\nCreating container...");
    console.log("\t", containerName);

    
    const containerClient = await blobServiceClient.getContainerClient(
      containerName
    );

    if (!containerClient.exists()) {
      const createContainerResponse = await containerClient.create({
        access: "container",
      });
      console.log(
        "Container was created successfully. requestId: ",
        createContainerResponse.requestId
      );
    }

    const blobName = "expenses" + uuidv1() + ".txt";

    
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    console.log("\nUploading to Azure storage as blob:\n\t", blobName);

    const data = JSON.stringify(await req.user.getAllExpenses());

    const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
    console.log(
      "Blob was uploaded successfully. requestId: ",
      JSON.stringify(uploadBlobResponse)
    );

  
    const fileUrl = `https://demostoragesharpener.blob.core.windows.net/${containerName}/${blobName}`;
    res.status(201).json({ fileUrl, success: true }); 
  } catch (err) {
    res
      .status(500)
      .json({ error: err, success: false, message: "Something went wrong" });
  }
};

module.exports = {
  addExpense,
  getAllExpenses,
  deleteExpense,
  downloadExpenses,
};
