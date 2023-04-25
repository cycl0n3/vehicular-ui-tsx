import {OrderResponse} from "./OrderResponse";

export interface OrderPageResponse {
    orders: OrderResponse[];
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
}