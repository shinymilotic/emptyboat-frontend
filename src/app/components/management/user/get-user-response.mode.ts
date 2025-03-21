import { User } from "./user.model";

export interface GetUserResponse {
    users: User[];
    total: number;
}