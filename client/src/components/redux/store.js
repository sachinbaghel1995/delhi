import AuthReducer from "./AuthSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore( {
  reducer: { auth: AuthReducer },
});
export default store;
