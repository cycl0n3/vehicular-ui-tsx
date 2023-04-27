import axios from "axios";

import {config} from "./Constants";

import {UserAuth} from "../types/UserAuth";

import {PageRequest} from "../types/PageRequest";

import {OrderPageResponse} from "../types/OrderPageResponse";

import {UserPageResponse} from "../types/UserPageResponse";

import {UserResponse} from "../types/UserResponse";

const instance = axios.create({
    baseURL: config.url.API_BASE_URL + "/" +config.url.API + "/" +config.url.API_VERSION,
});

const authenticate = (username: string, password: string) => {
    return instance.post<UserAuth>(
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
    return instance.post<UserAuth>(
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

const findMe = (user: UserAuth | null) => {
    if (!user) return Promise.reject("UserAuth is null");

    return instance.get<UserResponse>("/users/me", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
        },
    });
};

const findMyOrders = (user: UserAuth | null, searchQuery: string, pageRequest: PageRequest) => {
    if (!user) return Promise.reject("UserAuth is null");

    return instance.get<OrderPageResponse>("/orders/me", {
        params: {
            page: pageRequest.page,
            size: pageRequest.size,
            searchQuery: searchQuery,
        },
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
        }
    });
}

const findAllOrders = (user: UserAuth | null, pageRequest: PageRequest, text: string) => {
    if (!user) return Promise.reject("UserAuth is null");

    return instance.get<OrderPageResponse>("/orders", {
        params: {
            page: pageRequest.page,
            size: pageRequest.size,
            text: text,
        },
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
        }
    });
}

const findOrdersByUser = (user: UserAuth | null, username: string, searchQuery: string, pageRequest: PageRequest) => {
    if (!user) return Promise.reject("UserAuth is null");

    return instance.get<OrderPageResponse>(`/orders/other/${username}`, {
        params: {
            page: pageRequest.page,
            size: pageRequest.size,
            searchQuery: searchQuery,
        },
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
        }
    });
}

const findAllUsers = (user: UserAuth | null, searchQuery: string, pageRequest: PageRequest) => {
    if (!user) return Promise.reject("UserAuth is null");

    return instance.get<UserPageResponse>("/users", {
        params: {
            searchQuery: searchQuery,
            page: pageRequest.page,
            size: pageRequest.size,
        },
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
        }
    });
};

const createOrder = (user: UserAuth | null, description: string) => {
    if (!user) return Promise.reject("UserAuth is null");

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

const createOrderForUser = (user: UserAuth | null, username: string, description: string) => {
    if (!user) return Promise.reject("UserAuth is null");

    return instance.post(
        `/orders/${username}/create`,
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

const approveOrder = (user: UserAuth | null, orderId: string) => {
    if (!user) return Promise.reject("UserAuth is null");

    return instance.post(
        `/orders/${orderId}/accept`,
        {},
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.accessToken}`,
            },
        }
    );
}

const rejectOrder = (user: UserAuth | null, orderId: string) => {
    if (!user) return Promise.reject("UserAuth is null");

    return instance.post(
        `/orders/${orderId}/reject`,
        {},
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.accessToken}`,
            },
        }
    );
}

const uploadProfilePicture = (user: UserAuth | null, file: File) => {
    if (!user) return Promise.reject("UserAuth is null");

    const formData = new FormData();
    formData.append("profile-picture", file);

    return instance.post("/users/profile-picture", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.accessToken}`,
        },
    });
}

const UPLOAD_PROFILE_PICTURE_URL = config.url.API_BASE_URL + "/" +config.url.API + "/" +config.url.API_VERSION + "/users/profile-picture";

export const connection = {
    UPLOAD_PROFILE_PICTURE_URL,
    authenticate,
    register,
    uploadProfilePicture,
    findMe,
    findMyOrders,
    findAllUsers,
    createOrder,
    findAllOrders,
    findOrdersByUser,
    createOrderForUser,
    approveOrder,
    rejectOrder,
};
