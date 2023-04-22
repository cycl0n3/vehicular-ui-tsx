import {createSlice} from "@reduxjs/toolkit";

const initialState = {
}

const consoleSlice = createSlice({
    name: 'console',
    initialState,
    reducers: {
        log: (state, action) => {
            console.log("Console REDUX:", action.payload)
        }
    }
});

export const {log} = consoleSlice.actions;
export default consoleSlice.reducer;
