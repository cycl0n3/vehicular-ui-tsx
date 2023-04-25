export interface OrderResponse {
    id: string;
    description: string;
    createdAt: string;
    status: number;
}

export const DEFAULT_ORDER_RESPONSE: OrderResponse = {
    id: "",
    description: "",
    createdAt: "",
    status: 0
}
