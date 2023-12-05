import logo from "./logo.svg";
// import './App.css';
import SignupForm from "./pages/SignUpForm";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AddExpense from "./components/AddExpense";
import ShowExpense from "./components/ShowExpense";
import PremiumFeature from "./components/PremiumFeature";
import ResetPassword from "./pages/ResetPassword";
import { Navbar } from "react-bootstrap";
import Header from "./components/Navbar";
import { useSelector } from "react-redux";
import Reset from "./pages/Reset";

function App() {

  return (
    <div className="App">
      <Header />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/addExpense" element={<AddExpense />} />
        <Route path="/getExpense" element={<ShowExpense />} />
        <Route path="/premium" element={<PremiumFeature />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/reset" element={<Reset />} />
      </Routes>
    </div>
  );
}

export default App;
