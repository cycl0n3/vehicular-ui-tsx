import {configureStore} from "@reduxjs/toolkit";

import consoleReducer from "./console/consoleSlice";

export const store = configureStore({
    reducer: {
        console: consoleReducer
    }
});

// Path: src\redux\console\consoleSlice.ts
