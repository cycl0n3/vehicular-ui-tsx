import {createSlice} from "@reduxjs/toolkit";

console.log("REDUX: user/index.ts");

const initialState = {
    user: {
        name: "John Doe",
    }
}

const index = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setName: (state, action) => {
            state.user.name = action.payload;
        }
    }
});

export const {setName} = index.actions;

export default index.reducer;
