-- Allow primary keys
PRAGMA foreign_keys = ON;

-- Table for Departments
CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    abbreviation TEXT,
    description TEXT
);

-- Table for Instructors
CREATE TABLE instructors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Table for Instructor Reviews (one-to-many)
CREATE TABLE instructor_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    instructor_id INTEGER NOT NULL,
    quality_score INTEGER NOT NULL CHECK (quality_score >= 1 AND quality_score <= 5),
    difficulty_score INTEGER NOT NULL CHECK (difficulty_score >= 1 AND quality_score <= 5),
    review TEXT,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id)
);

-- Table for Office Hours (associated with instructors)
CREATE TABLE office_hours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    instructor_id INTEGER NOT NULL,
    days_of_week TEXT NOT NULL,  -- e.g. 'Tuesday'
    time_of_day TEXT NOT NULL,      -- e.g. '2:00 PM - 4:00 PM'
    type TEXT NOT NULL,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id)
);

-- Table for Sections (for courses)
CREATE TABLE sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    days_of_week TEXT NOT NULL,  -- e.g. 'Monday,Wednesday'
    time_of_day TEXT NOT NULL,
    type TEXT NOT NULL            -- e.g. 'Lecture', 'Lab'
);

-- Table for Courses
CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_id INTEGER NOT NULL,
    course_code TEXT NOT NULL,
    instruction_mode TEXT,
    terms_offered TEXT NOT NULL, -- e.g. 'Fall,Spring'
    credits INT NOT NULL,
    description TEXT,
    instructor_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (instructor_id) REFERENCES instructors(id)
);

-- Join table for Course Sections (many-to-many)
CREATE TABLE course_sections (
    course_id INTEGER NOT NULL,
    section_id INTEGER NOT NULL,
    PRIMARY KEY (course_id, section_id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (section_id) REFERENCES sections(id)
);

-- Join table for Course Prerequisites (self-referencing many-to-many)
CREATE TABLE course_prerequisites (
    course_id INTEGER NOT NULL,
    prerequisite_course_id INTEGER NOT NULL,
    PRIMARY KEY (course_id, prerequisite_course_id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (prerequisite_course_id) REFERENCES courses(id)
);

-- Table to store course attributes
CREATE TABLE course_attributes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
);

-- Join table to map courses to their attributes
CREATE TABLE course_attribute_mapping (
    course_id INTEGER NOT NULL,
    attribute_id INTEGER NOT NULL,
    PRIMARY KEY (course_id, attribute_id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (attribute_id) REFERENCES course_attributes(id)
);

-- Table for Nodes (each node can represent a course, degree, etc.)
CREATE TABLE nodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    number INTEGER,
    course_id INTEGER,
    dropdown_children BOOLEAN NOT NULL DEFAULT 0 CHECK (dropdown_children IN (0, 1)),
    department_id INTEGER,
    FOREIGN KEY (course_id) REFERENCES courses(id)
    FOREIGN KEY (department_id) REFERENCES departments(id)
    -- Additional columns (e.g., description) can be added here if needed
);

-- Join table for Node Prerequisites (self-referencing many-to-many relationship)
CREATE TABLE node_prerequisites (
    node_id INTEGER NOT NULL,
    prerequisite_node_id INTEGER NOT NULL,
    PRIMARY KEY (node_id, prerequisite_node_id),
    FOREIGN KEY (node_id) REFERENCES nodes(id),
    FOREIGN KEY (prerequisite_node_id) REFERENCES nodes(id)
);

CREATE TABLE node_attribute_mapping (
    node_id INTEGER NOT NULL,
    attribute_id INTEGER NOT NULL,
    PRIMARY KEY (node_id, attribute_id),
    FOREIGN KEY (node_id) REFERENCES nodes(id),
    FOREIGN KEY (attribute_id) REFERENCES course_attributes(id)
);

-- Join table for Node Chosen Classes (maps nodes to courses they choose)
CREATE TABLE node_course_mapping (
    node_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    PRIMARY KEY (node_id, course_id),
    FOREIGN KEY (node_id) REFERENCES nodes(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    salt VARCHAR(64) NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);
