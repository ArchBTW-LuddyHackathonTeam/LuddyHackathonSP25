export interface AddDepartmentInput {
    name: string;
    abbreviation ?: string;
    description ?: string;
}

export interface AddUserInput {
    salt: string;
    username: string;
    password: string;
}

export interface User {
    id: string,
    salt: string,
    username: string,
    password: string
}
