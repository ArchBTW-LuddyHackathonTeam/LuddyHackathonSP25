export interface Input {
    [key: string] : any;
}

export interface AddInput extends Input {}

export interface EditInput extends Input {
    id: number;
}

export interface AddDepartmentInput extends AddInput {
    name: string;
    abbreviation ?: string;
    description ?: string;
}

export interface EditDepartmentInput extends EditInput {
    name ?: string;
    abbreviation ?: string;
    description ?: string;
}

export interface AddInstructorInput extends AddInput {
    name: string;
    department_id: number;
}

export interface EditInstructorInput extends EditInput {
    name ?: string;
    department_id ?: string;
}

export interface AddCourseInput extends AddInput {
    department_id: number;
    course_code: string;
    instruction_mode ?: string;
    terms_offered: string;
    credits: number;
    description ?: string;
    instructor_id ?: number;
}

export interface EditCourseInput extends EditInput {
    department_id ?: number;
    course_code ?: string;
    instruction_mode ?: string;
    terms_offered ?: string;
    credits ?: number;
    description ?: string;
    instructor_id ?: number;
}

export interface AddSectionInput extends AddInput {
    days_of_week: string;
    time_of_day: string;
    type: string;
}

export interface EditSectionInput extends EditInput {
    days_of_week ?: string;
    time_of_day ?: string;
    type ?: string;
}

export interface AddCourseAttributeInput extends AddInput {
    name: string;
    description ?: string;
}

export interface EditCourseAttributeInput extends EditInput {
    name ?: string;
    description ?: string;
}

export interface AddUserInput extends AddInput {
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

export interface DepartmentCourses {
    courses: Course[]
}

export interface Course {
    id: string
}
