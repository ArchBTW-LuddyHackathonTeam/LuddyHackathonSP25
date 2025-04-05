import { DepartmentCourses } from "../graphql/db-types";
import internalRequest from "../graphql/internal"

export interface Node {
  id: number;
  titleValue?: string;
  numberValue?: number;
  attributes?: Attribute[];
  chooseNClasses?: number[];
  courseID?: number;
  dropdownChildren?: boolean;
  department?: string;
  preRecs: Node[];
}

export enum Attribute {
  AH = "A&H",
  SH = "S&H",
  WC = "World Culture",
  WL = "World Language",
  NM = "N&M",
  IW = "Intensive Writing",
  EC = "English Composition",
  MM = "Mathematical Modeling",
}

export function departmentCourses(name: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        internalRequest(`
            query Departments($name: String!) {
                department_name(name: $name) {
                    courses {
                        id
                    }
                }
            }`, { name })
                .then(data => {
                    if (data && data.department_name) return data.department_name as DepartmentCourses
                    else throw new Error()
                })
                .then((data: DepartmentCourses) => data.courses.map(course => course.id))
                .then(resolve)
                .catch(e => reject(e))
    })
}
