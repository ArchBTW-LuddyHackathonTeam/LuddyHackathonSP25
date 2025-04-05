export interface AddDepartmentInput {
    [key: string]: any;
    name: string;
    abbreviation ?: string;
    description ?: string;
}

export interface EditDepartmentInput {
    [key: string]: any;
    id: number;
    name ?: string;
    abbreviation ?: string;
    description ?: string;
}

export interface AddUserInput {
    [key: string]: any;
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
