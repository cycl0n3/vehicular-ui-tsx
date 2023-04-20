import axios, {AxiosInstance, AxiosResponse} from "axios";

import {config} from "./Constants";

import {ILocalUser} from "../context/ILocalUser";

const instance: AxiosInstance = axios.create({
    baseURL: config.url.API_BASE_URL,
});

const authenticate = (
    username: string,
    password: string
): Promise<AxiosResponse<any, any>> => {
    return instance.post(
        "/auth/authenticate",
        {
            username,
            password,
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
};

const register = (
    name: string,
    username: string,
    email: string,
    password: string
): Promise<AxiosResponse<any, any>> => {
    return instance.post(
        "/auth/signup",
        {
            name,
            username,
            email,
            password,
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
};

const findMe = (user: ILocalUser | null): Promise<AxiosResponse<any, any>> => {
    if (!user) return Promise.reject("User is null");

    return instance.get("/api/users/me", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
        },
    });
};

const findAllUsers = (
    user: ILocalUser | null
): Promise<AxiosResponse<any, any>> => {
    if (!user) return Promise.reject("User is null");

    return instance.get("/api/users", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
        },
    });
};

const createOrder = (user: ILocalUser | null, description: string): Promise<AxiosResponse<any, any>> => {
    if (!user) return Promise.reject("User is null");

    return instance.post(
        "/api/orders",
        {
            description,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.accessToken}`,
            },
        }
    );
}

export const connection = {
    authenticate,
    register,
    findMe,
    findAllUsers,
    createOrder
};
