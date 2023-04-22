import axios from "axios";

import {config} from "./Constants";

import {ILocalUser} from "../context/ILocalUser";

const instance = axios.create({
    baseURL: config.url.API_BASE_URL,
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

const register = (name: string, username: string, email: string, password: string) => {
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

const findMe = (user: ILocalUser | null) => {
    if (!user) return Promise.reject("User is null");

    return instance.get("/api/users/me", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
        },
    });
};

const findAllUsers = (user: ILocalUser | null) => {
    if (!user) return Promise.reject("User is null");

    return instance.get("/api/users", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
        },
    });
};

const createOrder = (user: ILocalUser | null, description: string) => {
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

const uploadProfilePicture = (user: ILocalUser | null, file: File) => {
    if (!user) return Promise.reject("User is null");

    const formData = new FormData();
    formData.append("profile-picture", file);

    return instance.post("/api/users/profile-picture", formData, {
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
