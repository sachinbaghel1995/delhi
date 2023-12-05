import {createSlice} from '@reduxjs/toolkit'
const loggedIn=localStorage.getItem('token')?true:false
const initialState={
isLoggedIn:loggedIn
}
const AuthSlice=createSlice({
    name:'auth',
    initialState:initialState,
    reducers:{
        login(state){
            state.isLoggedIn=true
        },
        logout(state){
            state.isLoggedIn=false
        }
    }
})
export const {login,logout}=AuthSlice.actions
export default AuthSlice.reducer