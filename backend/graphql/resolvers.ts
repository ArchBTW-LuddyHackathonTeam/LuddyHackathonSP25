import db from "./db";
import { AddUserInput, AddDepartmentInput, EditDepartmentInput, AddInstructorInput, EditInstructorInput } from "./db-types";

const getById = (table: string, id: number) => {
  return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id)
}

const addEntry = (table: string, entry: AddUserInput | AddDepartmentInput) => {
    const keys = Object.keys(entry);

    const values: any[] = [];
    const fields: string[] = [];

    for (const key of keys) {
        fields.push(key);
        values.push(entry[key]);
    }

    const statement = db.prepare(`INSERT INTO ${table} (${fields.join(", ")}) VALUES (${Array(fields.length).fill("?").join(", ")})
               RETURNING *`);

    return statement.get(...values);
}

const editEntry = (table: string, entry: EditDepartmentInput) => {
    const { id, ...updateFields } = entry;

    const keys = Object.keys(updateFields).filter(key => updateFields[key] !== undefined);

    if (keys.length === 0) {
        throw new Error("No fields provided to update.");
    }

    const setClause = keys.map(key => `${key} = ?`).join(", ");
    const values = keys.map(key => updateFields[key]);

    const statement = db.prepare(`
        UPDATE ${table}
        SET ${setClause}
        WHERE id = ?
        RETURNING *
    `);

    return statement.get(...values, id);
};

export const resolvers = {
  Query: {
    departments: () => db.prepare('SELECT * FROM departments').all(),
    department: (_parent: any, { id }: { id: number }) => getById('departments', id),

    instructors: () => db.prepare('SELECT * FROM instructors').all(),
    instructor: (_parent: any, { id }: { id: number }) => getById('instructors', id),

    courses: () => db.prepare('SELECT * FROM courses').all(),
    course: (_parent: any, { id }: { id: number }) => getById('courses', id),

    sections: () => db.prepare('SELECT * FROM sections').all(),
    section: (_parent: any, { id }: { id: number }) => getById('sections', id),

    course_attributes: () => db.prepare('SELECT * FROM course_attributes').all(),
    course_attribute: (_parent: any, { id }: { id: number }) => getById('course_attributes', id),
    
    users: () => db.prepare("SELECT * FROM users").all(),
    user: (_parent: any, { id }: { id: number }) => getById("users", id),
    user_username: (_parent: any, { username }: { username: string }) => db.prepare("SELECT * FROM users WHERE username = ?").get(username),
  },

  Department: {
    instructors: (parent: any) =>
      db.prepare('SELECT * FROM instructors WHERE department_id = ?').all(parent.id),
    courses: (parent: any) =>
      db.prepare('SELECT * FROM courses WHERE department_id = ?').all(parent.id),
  },

  Instructor: {
    department: (parent: any) =>
      db.prepare('SELECT * FROM departments WHERE id = ?').get(parent.department_id),
    reviews: (parent: any) =>
      db.prepare('SELECT * FROM instructor_reviews WHERE instructor_id = ?').all(parent.id),
    officeHours: (parent: any) =>
      db.prepare('SELECT * FROM office_hours WHERE instructor_id = ?').all(parent.id),
    courses: (parent: any) =>
      db.prepare('SELECT * FROM courses WHERE instructor_id = ?').all(parent.id),
  },

  InstructorReview: {
    instructor: (parent: any) =>
      db.prepare('SELECT * FROM instructors WHERE id = ?').get(parent.instructor_id),
  },

  OfficeHour: {
    instructor: (parent: any) =>
      db.prepare('SELECT * FROM instructors WHERE id = ?').get(parent.instructor_id),
  },

  Course: {
    department: (parent: any) =>
      db.prepare('SELECT * FROM departments WHERE id = ?').get(parent.department_id),
    instructor: (parent: any) =>
      db.prepare('SELECT * FROM instructors WHERE id = ?').get(parent.instructor_id),
    sections: (parent: any) =>
      db
        .prepare(`
          SELECT s.* FROM sections s
          JOIN course_sections cs ON s.id = cs.section_id
          WHERE cs.course_id = ?
        `)
        .all(parent.id),
    prerequisites: (parent: any) =>
      db
        .prepare(`
          SELECT c.* FROM courses c
          JOIN course_prerequisites cp ON c.id = cp.prerequisite_course_id
          WHERE cp.course_id = ?
        `)
        .all(parent.id),
    required_for: (parent: any) =>
      db
        .prepare(`
          SELECT c.* FROM courses c
          JOIN course_prerequisites cp ON c.id = cp.course_id
          WHERE cp.prerequisite_course_id = ?
        `)
        .all(parent.id),
    attributes: (parent: any) =>
      db
        .prepare(`
          SELECT ca.* FROM course_attributes ca
          JOIN course_attribute_mapping cam ON ca.id = cam.attribute_id
          WHERE cam.course_id = ?
        `)
        .all(parent.id),
  },

  Section: {
    courses: (parent: any) =>
      db
        .prepare(`
          SELECT c.* FROM courses c
          JOIN course_sections cs ON c.id = cs.course_id
          WHERE cs.section_id = ?
        `)
        .all(parent.id),
  },

  CourseAttribute: {
    courses: (parent: any) =>
      db
        .prepare(`
          SELECT c.* FROM courses c
          JOIN course_attribute_mapping cam ON c.id = cam.course_id
          WHERE cam.attribute_id = ?
        `)
        .all(parent.id),
  },

  Node: {
    attributes: (parent: any) =>
      db
        .prepare(
          `
          SELECT ca.* FROM course_attributes ca
          JOIN node_attribute_mapping nam ON ca.id = nam.attribute_id
          WHERE nam.node_id = ?
        `
        )
        .all(parent.id),

    prerequisites: (parent: any) =>
      db
        .prepare(
          `
          SELECT n.* FROM nodes n
          JOIN node_prerequisites np ON n.id = np.prerequisite_node_id
          WHERE np.node_id = ?
        `
        )
        .all(parent.id),

    chooseNClasses: (parent: any) =>
      db
        .prepare(
          `
          SELECT course_id FROM node_course_mapping
          WHERE node_id = ?
        `
        )
        .all(parent.id)
        .map((row: any) => row.course_id),
      
    department: (parent: any) => {
      if (!parent.department_id) return null;
      const department = db
        .prepare("SELECT name FROM departments WHERE id = ?")
        .get(parent.department_id);
      return department ? department.name : null;
    },
  },

  Mutation: {
    addDepartment: (_parent: any, { department }: { department: AddDepartmentInput }) => 
    addEntry("departments", department),

    updateDepartment: (_parent: any, { department }: { department: EditDepartmentInput }) => 
        editEntry("departments", department),

    addInstructor: (_parent: any, { instructor }: { instructor: AddInstructorInput }) => 
        addEntry("instructors", instructor),

    updateInstructor: (_parent: any, { instructor }: { instructor: EditInstructorInput }) => 
        editEntry("instructors", instructor),

    addUser: (_parent: any, { user }: { user: AddUserInput }) => addEntry("users", user),

    deleteUser: (_parent: any, { id }: { id: number }) => // TODO: Add false return if user was not in database
        !!db.prepare(`DELETE FROM users WHERE id = ?`).run(id),
  },
}
