import {createSlice} from "@reduxjs/toolkit";

console.log("REDUX: user/index.ts");

const initialState = {
    username: "",
    accessToken: "",
};

const index = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action): void => {
            state.username = action.payload.username;
            state.accessToken = action.payload.accessToken;
        },
        logout: (state): void => {
            state.username = "";
            state.accessToken = "";
        }
    }
});

export const {login, logout} = index.actions;

export default index.reducer;
