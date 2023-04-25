import {OrderResponse} from "./OrderResponse";

export interface UserResponse {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    profilePicture: string;
    orders: OrderResponse[];
}