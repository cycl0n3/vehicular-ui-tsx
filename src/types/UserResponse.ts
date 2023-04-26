import {OrderResponse} from "./OrderResponse";

export interface UserResponse {
    id: number;
    title: string;
    name: string;
    age: number;
    username: string;
    email: string;
    role: string;
    profilePicture: string;
    orderCounts: {
        orderCount: number;
        acceptedOrderCount: number;
        rejectedOrderCount: number;
        pendingOrderCount: number;
    };
}

export const DEFAULT_USER_RESPONSE: UserResponse = {
    id: 0,
    title: "",
    name: "",
    age: 0,
    username: "",
    email: "",
    role: "",
    profilePicture: "",
    orderCounts: {
        orderCount: 0,
        acceptedOrderCount: 0,
        rejectedOrderCount: 0,
        pendingOrderCount: 0,
    },
}
