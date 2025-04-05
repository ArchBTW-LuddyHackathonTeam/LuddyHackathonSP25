-- Table for Departments
CREATE TABLE departments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100),
    description TEXT
);

-- Table for Instructors
CREATE TABLE instructors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100),
    department_id VARCHAR(50),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Table for Instructor Reviews (one-to-many)
CREATE TABLE instructor_reviews (
    id SERIAL PRIMARY KEY,
    instructor_id VARCHAR(50),
    review TEXT,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id)
);

-- Table for Office Hours (associated with instructors)
CREATE TABLE office_hours (
    id VARCHAR(50) PRIMARY KEY,
    instructor_id VARCHAR(50),
    days_of_week VARCHAR(100),  -- e.g. 'Tuesday'
    time_of_day VARCHAR(50),      -- e.g. '2:00 PM - 4:00 PM'
    type VARCHAR(50),
    FOREIGN KEY (instructor_id) REFERENCES instructors(id)
);

-- Table for Sections (for courses)
CREATE TABLE sections (
    id VARCHAR(50) PRIMARY KEY,
    days_of_week VARCHAR(100),  -- e.g. 'Monday,Wednesday'
    time_of_day VARCHAR(50),
    type VARCHAR(50)            -- e.g. 'Lecture', 'Lab'
);

-- Table for Courses
CREATE TABLE courses (
    id VARCHAR(50) PRIMARY KEY,
    department_id VARCHAR(50),
    course_code VARCHAR(50),
    instruction_node TEXT,
    terms_offered VARCHAR(100), -- e.g. 'Fall,Spring'
    credits INT,
    description TEXT,
    instructor_id VARCHAR(50),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (instructor_id) REFERENCES instructors(id)
);

-- Join table for Course Sections (many-to-many)
CREATE TABLE course_sections (
    course_id VARCHAR(50),
    section_id VARCHAR(50),
    PRIMARY KEY (course_id, section_id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (section_id) REFERENCES sections(id)
);

-- Join table for Course Prerequisites (self-referencing many-to-many)
CREATE TABLE course_prerequisites (
    course_id VARCHAR(50),
    prerequisite_course_id VARCHAR(50),
    PRIMARY KEY (course_id, prerequisite_course_id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (prerequisite_course_id) REFERENCES courses(id)
);

-- Table to store course attributes
CREATE TABLE course_attributes (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

-- Join table to map courses to their attributes
CREATE TABLE course_attribute_mapping (
    course_id VARCHAR(50),
    attribute_id VARCHAR(50),
    PRIMARY KEY (course_id, attribute_id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (attribute_id) REFERENCES course_attributes(id)
);
