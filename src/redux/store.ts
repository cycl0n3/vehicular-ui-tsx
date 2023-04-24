import {configureStore} from "@reduxjs/toolkit";

import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

import consoleReducer from "./console";

import userReducer from "./user";

export const store = configureStore({
    reducer: {
        console: consoleReducer,
        user: userReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
