import {OrderResponse} from "./OrderResponse";

export interface OrderPageResponse {
    orders: OrderResponse[];
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
}

export const DEFAULT_ORDER_PAGE_RESPONSE: OrderPageResponse = {
    orders: [],
    currentPage: 0,
    totalItems: 0,
    itemsPerPage: 0,
    totalPages: 0
}
