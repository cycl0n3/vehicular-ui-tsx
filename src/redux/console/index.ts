import {createSlice} from "@reduxjs/toolkit";

const initialState = {
}

const index = createSlice({
    name: 'console',
    initialState,
    reducers: {
        log: (state, action) => {
            console.log("Console REDUX:", action.payload)
        }
    }
});

export const {log} = index.actions;

export default index.reducer;
