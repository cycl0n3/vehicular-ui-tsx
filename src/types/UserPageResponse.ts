import {UserResponse} from "./UserResponse";

export interface UserPageResponse {
    users: UserResponse[];
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
}

export const DEFAULT_USER_PAGE_RESPONSE: UserPageResponse = {
    users: [],
    currentPage: 0,
    totalItems: 0,
    itemsPerPage: 0,
    totalPages: 0
}
