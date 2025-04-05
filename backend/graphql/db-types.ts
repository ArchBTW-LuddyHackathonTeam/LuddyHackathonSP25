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

export interface AddInstructorInput {
    [key: string]: any;
    name: string;
    department_id: number;
}

export interface EditInstructorInput {
    [key: string]: any;
    id: number;
    name ?: string;
    department_id ?: string;
}

export interface AddCourseInput {
    [key: string]: any;
    department_id: number;
    course_code: string;
    instruction_mode ?: string;
    terms_offered: string;
    credits: number;
    description ?: string;
    instructor_id ?: number;
}

export interface EditCourseInput {
    [key: string]: any;
    id: number;
    department_id ?: number;
    course_code ?: string;
    instruction_mode ?: string;
    terms_offered ?: string;
    credits ?: number;
    description ?: string;
    instructor_id ?: number;
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
