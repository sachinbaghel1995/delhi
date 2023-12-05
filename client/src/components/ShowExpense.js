// ShowDish.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./ShowExpense.module.scss"; // Import the SCSS module

const ShowExpense = () => {
  const token = localStorage.getItem("token");
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(1); // Initialize page to 1
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();

  const calculateTotalAmount = () => {
    return expenses.reduce(
      (total, expense) => total + expense.expenseamount,
      0
    );
  };
  const totalAmount = calculateTotalAmount();
  useEffect(() => {
    const getExpenseData = async () => {
      console.log(token);
      const { data } = await axios.get(
        `/api/expenses/getExpense?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: token },
        }
      );
      setExpenses(data.rows);
      console.log(data);
    };
    getExpenseData();
  }, [page, limit, token]);

  const handleDelete = async (id) => {
    await axios.delete(`/api/expenses/${id}`);
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id)
    );
    navigate("/getExpense");
  };
  const downloadExpense = () => {
    const expensesData = expenses.map((expense) => [
      expense.expenseamount,
      expense.category,
      expense.description,
    ]);

    const header = "Amount,Category,Description\n";
    const csv = header + expensesData.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });

    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "myexpenses.csv";

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
  };

  const title = ["Amount", "Category", "Description"];
  const data = [title];

  expenses.forEach((item) => {
    data.push([item.amount, item.category, item.description]);
  });

  const renderTable = (tableDishes) => {
    if (tableDishes.length > 0) {
      return (
        <div className={styles["table-container"]}>
          <h2>Total Amount: {totalAmount}</h2>
          <Table className={styles["table"]} striped bordered>
            <thead>
              <tr>
                <th>Amount</th>

                <th>Description</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {tableDishes.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.expenseamount}</td>

                  <td>{expense.description}</td>
                  <td>{expense.category}</td>
                  <td>
                    <button
                      className={styles["delete-button"]}
                      onClick={() => handleDelete(expense.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <Container className={styles["show-dish-container"]}>
      <h1 className="text-center">Expenses</h1>
      <hr />
      <div className={styles["dish-table"]}>
        <h2 className={styles["table-header"]}>Food</h2>
        {renderTable(expenses.filter((expense) => expense.category === "food"))}
      </div>
      <div className={styles["dish-table"]}>
        <h2 className={styles["table-header"]}>Electronics</h2>
        {renderTable(
          expenses.filter((expense) => expense.category === "electronics")
        )}
      </div>
      <div className={styles["dish-table"]}>
        <h2 className={styles["table-header"]}>Clothes</h2>
        {renderTable(
          expenses.filter((expense) => expense.category === "clothes")
        )}
      </div>
      <button onClick={downloadExpense}>download</button>
      <div>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous Page
        </button>
        <span>Page {page}</span>
        <button
          disabled={expenses.length < limit}
          onClick={() => setPage(page + 1)}
        >
          Next Page
        </button>
      </div>
    </Container>
  );
};

export default ShowExpense;
