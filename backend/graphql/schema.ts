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
  terms_offered: [String!]
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
  course_id: ID,
  dropdown_children: Boolean,
  department: Department,
  prerequisites: [Node],
  prerequisite_ids: [ID!]
  attributes: [CourseAttribute!],
  chooseNClasses: [ID!]
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
  department_name(name: String!): Department
  department_abbrev(abbrev: String!): [Department!]

  instructors: [Instructor!]
  instructor(id: ID!): Instructor

  courses: [Course!]
  courses_ids(ids: [ID!]): [Course!]
  course(id: ID!): Course

  sections: [Section!]
  section(id: ID!): Section

  course_attributes: [CourseAttribute!]
  course_attribute(id: ID!): CourseAttribute
  course_attributes_abbrev(abbrev: String!): [CourseAttribute!]

  users: [User!]
  user(id: ID!): User
  user_username(username: String!): User

  nodes: [Node!]
  node(id: ID!): Node
}

# Mutations
type Mutation {
  addDepartment(department: AddDepartmentInput!): Department
  updateDepartment(department: EditDepartmentInput!): Department
  deleteDepartment(id: ID!): Boolean!

  addInstructor(instructor: AddInstructorInput!): Instructor
  updateInstructor(instructor: EditInstructorUpdate!): Instructor
  deleteInstructor(id: ID!): Boolean!

  addCourse(course: AddCourseInput!): Course
  updateCourse(course: EditCourseInput!): Course
  deleteCourse(id: ID!): Boolean!

  addSection(section: AddSectionInput!): Section
  updateSection(section: EditSectioninput!): Section
  deleteSection(id: ID!): Boolean!

  addCourseAttribute(courseAttribute: AddCourseAttributeInput!): CourseAttribute
  updateCourseAttribute(courseAttribute: EditCourseAttributeInput!): CourseAttribute
  deleteCourseAttribute(id: ID!): Boolean!

  addCourseTermOffered(courseTermOffered: AddcourseTermOfferedInput!): Course

  addInstructorOfficeHours(officeHour: AddInstructorOfficeHourInput!): OfficeHour
  updateInstructorOfficeHours(officeHour: EditInstructorOfficeHourInput!): OfficeHour
  deleteInstructorOfficeHours(id: ID!): Boolean!

  addCourseSection(relation: AddCourseSectionInput!): Course

  addCoursePrerequisite(relation: AddCoursePrerequisiteInput!): Course

  addCourseAttributeRelation(relation: AddCoursePrerequisiteRelationInput!): Course

  addNode(node: AddNodeInput): Node
  updateNode(node: EditNodeInput): Node
  deleteNode(id: ID!): Boolean!

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

# Instructor Mutation Inputs
input AddInstructorInput {
  name: String!
  department_id: ID!
}

input EditInstructorUpdate {
  id: ID!
  name: String
  department_id: ID
}

# Course Mutation Inputs
input AddCourseInput {
  department_id: ID!
  course_code: String!
  instruction_mode: String
  credits: Int!
  description: String
  instructor_id: ID
}

input EditCourseInput {
  id: ID!
  department_id: ID
  course_code: String
  instruction_mode: String
  credits: Int
  description: String
  instructor_id: ID
}

# Section Mutation Inputs
input AddSectionInput {
  days_of_week: String!
  time_of_day: String!
  type: String!
}

input EditSectioninput {
  id: ID!
  days_of_week: String
  time_of_day: String
  type:String
}

# Course Attributes Mutation Inputs
input AddCourseAttributeInput {
  name: String!
  description: String  
}

input EditCourseAttributeInput {
  id: ID!
  name: String
  description: String
}

# Course Terms Offered Mutation Inputs
input AddcourseTermOfferedInput {
  course_id: ID!
  term_offered: String!
}

# Instructor Office Hour Mutation Inputs
input AddInstructorOfficeHourInput {
  instructor_id: ID!
  days_of_week: String!
  time_of_day: String!
  type: String!
}

input EditInstructorOfficeHourInput {
  id: ID!
  instructor_id: ID
  days_of_week: String
  time_of_day: String
  type: String
}

# Course Section Mutation Inputs
input AddCourseSectionInput {
  course_id: ID!
  section_id: ID!
}

# Course Prerequisite Mutation Inputs
input AddCoursePrerequisiteInput {
  course_id: ID!
  prerequisite_course_id: ID!
}

# Course Attribute Relation Mutation Inputs
input AddCoursePrerequisiteRelationInput {
  course_id: ID!
  attribute_id: ID!
}

# Node Mutation Inputs
input AddNodeInput {
  title: String
  number: String
  course_id: ID
  dropdown_children: Boolean!
  department_id: ID
}

input EditNodeInput {
  id: ID!
  title: String
  number: String
  course_id: ID
  dropdown_children: Boolean
  department_id: ID
}

# User Mutation Inputs
input AddUserInput {
  salt: String!
  username: String!
  password: String!
}

`
