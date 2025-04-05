-- Allow primary keys
PRAGMA foreign_keys = ON;

-- Table for Departments
CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT
);

-- Table for Instructors
CREATE TABLE instructors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Table for Instructor Reviews (one-to-many)
CREATE TABLE instructor_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    instructor_id INTEGER,
    review TEXT,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id)
);

-- Table for Office Hours (associated with instructors)
CREATE TABLE office_hours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    instructor_id INTEGER,
    days_of_week TEXT,  -- e.g. 'Tuesday'
    time_of_day TEXT,      -- e.g. '2:00 PM - 4:00 PM'
    type TEXT,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id)
);

-- Table for Sections (for courses)
CREATE TABLE sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    days_of_week TEXT,  -- e.g. 'Monday,Wednesday'
    time_of_day TEXT,
    type TEXT            -- e.g. 'Lecture', 'Lab'
);

-- Table for Courses
CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_id INTEGER,
    course_code TEXT,
    instruction_node TEXT,
    terms_offered TEXT, -- e.g. 'Fall,Spring'
    credits INT,
    description TEXT,
    instructor_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (instructor_id) REFERENCES instructors(id)
);

-- Join table for Course Sections (many-to-many)
CREATE TABLE course_sections (
    course_id INTEGER,
    section_id INTEGER,
    PRIMARY KEY (course_id, section_id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (section_id) REFERENCES sections(id)
);

-- Join table for Course Prerequisites (self-referencing many-to-many)
CREATE TABLE course_prerequisites (
    course_id INTEGER,
    prerequisite_course_id INTEGER,
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
    course_id INTEGER,
    attribute_id INTEGER,
    PRIMARY KEY (course_id, attribute_id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (attribute_id) REFERENCES course_attributes(id)
);
