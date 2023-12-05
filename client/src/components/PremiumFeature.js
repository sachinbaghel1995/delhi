import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PremiumFeature.scss";
import { useNavigate } from "react-router-dom";


const PremiumFeature = () => {
  const [leaderBoardList, setLeaderBoardList] = useState([]);
  const navigate=useNavigate()
  const token = localStorage.getItem("token");

  useEffect(() => {
    leaderBoard();
  }, []);

  const leaderBoard = async () => {
    const res = await axios.get("/api/premium/showleaderboard", {
      headers: { Authorization: token },
    });
    setLeaderBoardList(res.data);
  };

  return (
    <div className="PremiumFeature">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Total Expenses</th>
          </tr>
        </thead>
        <tbody>
          {leaderBoardList.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.totalExpenses}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={()=>navigate('/addExpense')}>AddExpense</button>
    </div>
  );
};

export default PremiumFeature;
