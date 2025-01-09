
export interface CreateUserRequest {
    username?: string|null;
    password?: string|null;
    email?: string|null;
    bio?: string;
    image?: string;
    enabled?: boolean;
}
