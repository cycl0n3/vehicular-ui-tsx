import {UserResponse} from "./UserResponse";

export interface UserPageResponse {
    users: UserResponse[];
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
}