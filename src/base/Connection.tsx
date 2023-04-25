import axios from "axios";

import {config} from "./Constants";

import {User} from "../types/User";

import {PageRequest} from "../types/PageRequest";

import {OrderPageResponse} from "../types/OrderPageResponse";
import {UserPageResponse} from "../types/UserPageResponse";

const instance = axios.create({
    baseURL: config.url.API_BASE_URL + "/" +config.url.API + "/" +config.url.API_VERSION,
});

const authenticate = (username: string, password: string) => {
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

const register = (title: string, name: string, username: string, age: number, email: string, password: string) => {
    return instance.post(
        "/auth/register",
        {
            title,
            name,
            username,
            age,
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

const findMe = (user: User | null) => {
    if (!user) return Promise.reject("User is null");

    return instance.get("/users/me", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
        },
    });
};

const findMyOrders = (user: User | null, pageRequest: PageRequest) => {
    if (!user) return Promise.reject("User is null");

    return instance.get<OrderPageResponse>("/orders/me", {
        params: {
            page: pageRequest.page,
            size: pageRequest.size,
        },
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
        }
    });
}

const findAllUsers = (user: User | null, pageRequest: PageRequest) => {
    if (!user) return Promise.reject("User is null");

    return instance.get<UserPageResponse>("/users", {
        params: {
            page: pageRequest.page,
            size: pageRequest.size,
        },
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
        }
    });
};

const createOrder = (user: User | null, description: string) => {
    if (!user) return Promise.reject("User is null");

    return instance.post(
        "/orders",
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

const uploadProfilePicture = (user: User | null, file: File) => {
    if (!user) return Promise.reject("User is null");

    const formData = new FormData();
    formData.append("profile-picture", file);

    return instance.post("/users/profile-picture", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.accessToken}`,
        },
    });
}

export const connection = {
    authenticate,
    register,
    findMe,
    findAllUsers,
    createOrder,
    uploadProfilePicture,
    findMyOrders
};
