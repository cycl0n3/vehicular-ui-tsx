import {configureStore} from "@reduxjs/toolkit";

import consoleReducer from "./console";

export const store = configureStore({
    reducer: {
        console: consoleReducer
    }
});
