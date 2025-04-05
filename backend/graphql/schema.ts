export const typeDefs = `#graphql
# Department type
type Department {
  id: ID!
  name: String!
  abbreviation: String
  description: String
  instructors: [Instructor!]
  courses: [Course!]
}

# Instructor type
type Instructor {
  id: ID!
  name: String!
  department: Department!
  reviews: [InstructorReview!]
  officeHours: [OfficeHour!]
  courses: [Course!]
}

# Review for an instructor
type InstructorReview {
  id: ID!
  instructor: Instructor!
  quality_score: Int!
  difficulty_score: Int!
  review: String
}

# Office hours for an instructor
type OfficeHour {
  id: ID!
  instructor: Instructor!
  days_of_week: String!
  time_of_day: String!
  type: String!
}

# Course Section
type Section {
  id: ID!
  days_of_week: String!
  time_of_day: String!
  type: String!
  courses: [Course!]
}

# Course
type Course {
  id: ID!
  department: Department!
  course_code: String!
  instruction_mode: String
  terms_offered: String
  credits: Int!
  description: String
  instructor: Instructor
  sections: [Section!]
  prerequisites: [Course!]
  required_for: [Course!]
  attributes: [CourseAttribute!]
}

# Course Attribute
type CourseAttribute {
  id: ID!
  name: String!
  description: String
  courses: [Course!]
}

# Node
type Node {
  id: ID!
  title: String,
  number: Int,
  course_id: Course,
  dropdown_children: Boolean,
  department: Department,
  prerequisites: [Node],
  attributes: [CourseAttribute],
  chooseNClasses: [Course]
}

# Users
type User {
    id: ID!
    salt: String!
    username: String!
    password: String!
}

# Root Query
type Query {
  departments: [Department!]
  department(id: ID!): Department

  instructors: [Instructor!]
  instructor(id: ID!): Instructor

  courses: [Course!]
  course(id: ID!): Course

  sections: [Section!]
  section(id: ID!): Section

  course_attributes: [CourseAttribute!]
  course_attribute(id: ID!): CourseAttribute

  users: [User!]
  user(id: ID!): User
  user_username(username: String!): User
}

# Mutations
type Mutation {
  addDepartment(department: AddDepartmentInput!): Department
  updateDepartment(department: EditDepartmentInput!): Department

  addInstructor()

  addUser(user: AddUserInput!): User
  deleteUser(id: ID!): Boolean!
}

# Department Mutation Inputs
input AddDepartmentInput {
  name: String!
  abbreviation: String
  description: String
}

input EditDepartmentInput {
  id: ID!
  name: String
  abbreviation: String
  description: String
}

#Instructor Mutation Inputs
input AddInstructorInput {
  name: String!
  department_id: ID!
}

input EditInstructorUpdate {
  id: ID!
  name: String
  department_id: ID
}

# User Mutation Inputs
input AddUserInput {
  salt: String!
  username: String!
  password: String!
}

`
