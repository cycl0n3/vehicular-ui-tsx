import {configureStore} from "@reduxjs/toolkit";

import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

import logger from "redux-logger";

import consoleReducer from "./console";

import userReducer from "./user";

const middleware = [logger];

export const store = configureStore({
    reducer: {
        console: consoleReducer,
        user: userReducer
    },
    middleware
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
