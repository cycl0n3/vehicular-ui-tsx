import axios from "axios";

import {config} from "./Constants";

import {ILocalUser} from "../types/ILocalUser";

import {IPageRequest} from "../types/IPageRequest";

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

const findMe = (user: ILocalUser | null) => {
    if (!user) return Promise.reject("User is null");

    return instance.get("/users/me", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
        },
    });
};

const findAllUsers = (user: ILocalUser | null, pageRequest: IPageRequest) => {
    if (!user) return Promise.reject("User is null");

    return instance.get("/users", {
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

const createOrder = (user: ILocalUser | null, description: string) => {
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

const uploadProfilePicture = (user: ILocalUser | null, file: File) => {
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
    uploadProfilePicture
};
