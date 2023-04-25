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
    orderCount: number;
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
    orderCount: 0
}
