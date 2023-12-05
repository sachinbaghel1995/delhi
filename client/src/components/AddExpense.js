import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./AddExpense.module.scss"; // Import the SCSS module
import Razorpay from "razorpay";

const AddExpense = () => {
  const token = localStorage.getItem("token");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("food");
  const [isPremium, setIsPremium] = useState(false);
  const navigate = useNavigate();

  function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

  const addExpenseHandler = async (event) => {
    event.preventDefault();
    const data = {
      expenseamount: amount,
      category: category,
      description: description,
    };
    await axios.post("/api/expenses/addExpense", data, {
      headers: { Authorization: token },
    });

    navigate("/getExpense");
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get("/api/users/user", {
          headers: { Authorization: token },
        });

        if (response.data && response.data.user) {
          console.log(response.data.user);
          setIsPremium(response.data.user.ispremiumuser);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, [token]);

  console.log(isPremium);

  const razorpayHandler = async (e) => {
    const response = await axios.get("/api/purchase/premiummembership", {
      headers: { Authorization: token },
    });
    console.log(response);
    var options = {
      key: response.data.key_id,
      name: "sachin",
      order_id: response.data.order.id,
      prefill: {
        name: "Sachin Baghel",
        email: "baghel.sachin1996@gmail.com",
        contact: "0000000000",
      },
      theme: {
        color: "#3399cc",
      },

      handler: function (response) {
        console.log(response);

        const res = axios
          .post(
            "/api/purchase/updatetransactionstatus",
            {
              order_id: options.order_id,
              payment_id: response.razorpay_payment_id,
            },
            { headers: { Authorization: token } }
          )
          // console.log(res)
          .then(() => {
            alert("You are a Premium User Now");
            console.log(res);

            navigate("/premium");
          })
          .catch(() => {
            alert("Something went wrong. Try Again!!!");
          });
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();

    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
  };
  console.log(isPremium);
  return (
    <div className={styles["add-dish-container"]}>
      <h1>Add Expense</h1>
      <hr />
      <form onSubmit={addExpenseHandler}>
        <div className={styles["form-group"]}>
          <label className={styles["form-label"]} htmlFor="dish">
            Amount
          </label>
          <input
            className={styles["form-input"]}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            id="dish"
          />
        </div>

        <div className={styles["form-group"]}>
          <label className={styles["form-label"]} htmlFor="price">
            Description
          </label>
          <input
            className={styles["form-input"]}
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="price"
          />
        </div>

        <div className={styles["form-group"]}>
          <label className={styles["dropdown-label"]} htmlFor="table">
            Category
          </label>
          <select
            className={styles["dropdown-select"]}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            id="table"
          >
            <option value="food">food</option>
            <option value="electronics">electronics</option>
            <option value="clothes">clothes</option>
          </select>
        </div>

        <button className={styles["submit-button"]} type="submit">
          Add Expense
        </button>
      </form>
    {isPremium ? (
        <p>
          You are a Premium User
          <button
            onClick={() => {
              navigate("/premium");
            }}
          >
            Show Leaderboard
          </button>
        </p>
      ) : (
        <button id="rzp-button1" onClick={razorpayHandler}>
          Buy Premium
        </button>
      )}
   
    </div>
  );
};

export default AddExpense;
