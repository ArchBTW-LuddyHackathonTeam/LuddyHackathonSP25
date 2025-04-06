-- Insert data into departments
INSERT INTO departments (name, abbreviation, description) VALUES
('Computer Science', 'CS', 'Department of Computer Science'),
('Mathematics', 'MATH', 'Department of Mathematics'),
('Languages', 'LANG', 'Department of Languages'),
('Humanities', 'HUM', 'Department of Humanities');

-- Insert data into courses
INSERT INTO courses (department_id, course_code, instruction_mode, credits, description) VALUES
(1, '101', 'In-person', 3, 'Introduction to Computer Science'),
(1, '102', 'Online', 4, 'Data Structures'),
(1, '103', 'In-person', 4, 'Algorithms'),
(2, '101', 'In-person', 4, 'Calculus I'),
(2, '102', 'Online', 4, 'Calculus II'),
(3, '101', 'In-person', 3, 'Beginner French'),
(4, '101', 'In-person', 3, 'Introduction to Philosophy');

-- Insert data into instructors
INSERT INTO instructors (name, department_id) VALUES
('Alice Smith', 1),
('Bob Johnson', 2),
('Carol Williams', 3),
('David Brown', 4);

-- Insert data into instructor reviews
INSERT INTO instructor_reviews (instructor_id, quality_score, difficulty_score, review) VALUES
(1, 5, 3, 'Great instructor with clear explanations.'),
(1, 4, 4, 'Good course material but challenging.'),
(2, 3, 2, 'Okay instructor, could improve pacing.'),
(3, 4, 5, 'Excellent language teaching methods.'),
(4, 5, 3, 'Engaging and thoughtful lectures.');

-- Insert data into office hours
INSERT INTO office_hours (instructor_id, days_of_week, time_of_day, type) VALUES
(1, 'Monday', '2:00 PM - 3:00 PM', 'In-person'),
(2, 'Tuesday', '11:00 AM - 1:00 PM', 'Online'),
(3, 'Wednesday', '1:00 PM - 2:00 PM', 'In-person'),
(4, 'Thursday', '4:00 PM - 5:00 PM', 'In-person');

-- Insert data into sections
INSERT INTO sections (days_of_week, time_of_day, type) VALUES
('Monday,Wednesday,Friday', '9:00 AM - 10:00 AM', 'Lecture'),
('Tuesday,Thursday', '2:00 PM - 3:30 PM', 'Lab'),
('Monday,Wednesday', '11:00 AM - 12:30 PM', 'Lecture');

-- Insert data into courses terms offered
INSERT INTO courses_terms_offered (course_id, term_offered) VALUES
(1, 'Fall'),
(1, 'Spring'),
(2, 'Fall'),
(3, 'Spring'),
(4, 'Fall'),
(5, 'Summer'),
(6, 'Spring'),
(7, 'Fall');

-- Insert data into course sections
INSERT INTO course_sections (course_id, section_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 1),
(4, 2),
(5, 3),
(6, 1);

-- Insert data into course prerequisites
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES
(2, 1),
(3, 1),
(5, 4);

-- Insert data into course attributes
INSERT INTO course_attributes (name, description) VALUES
('A&H', 'Arts & Humanities'),
('S&H', 'Social & Historical Studies'),
('WC', 'World Culture'),
('WL', 'World Language'),
('N&M', 'Natural & Mathematical Science'),
('IW', 'Intensive Writing'),
('EC', 'English Composition'),
('MM', 'Mathematical Modeling');

-- Insert data into course attribute mapping
INSERT INTO course_attribute_mapping (course_id, attribute_id) VALUES
(1, 1),
(2, 8),
(3, 5),
(4, 8),
(5, 5),
(6, 4),
(7, 1);

-- Insert data into nodes
INSERT INTO nodes (id, title, number, course_id, dropdown_children, department_id) VALUES
(1, 'Computer Science BS', NULL, NULL, 0, 1),
(3, 'Bachelors of Science', NULL, NULL, 0, NULL),
(4, 'General Education Requirements', NULL, NULL, 0, NULL),
(5, 'Complete One English Composition Course', 3, NULL, 0, NULL),
(6, 'Complete One Mathematical Modeling Course', 3, NULL, 0, NULL),
(7, 'Complete 6 credits of Arts and Humanities courses', 6, NULL, 0, NULL),
(8, 'Complete 6 credits of Social and Historical Studies courses', 6, NULL, 0, NULL),
(9, 'Complete 5 credits of Natural and Mathematical Science courses', 5, NULL, 0, NULL),
(10, 'World Languages & Cultures Requirement', NULL, NULL, 1, NULL),
(11, 'Language Study', 3, NULL, 0, NULL),
(12, 'Complete 6 credits of World Culture courses', 6, NULL, 0, NULL),
(13, 'Study Abroad Program', NULL, NULL, 0, NULL),
(15, 'Complete 120 credit hours', 120, NULL, 0, NULL),
(16, 'Complete 36 credits at 300-400 level', 36, NULL, 0, NULL),
(17, 'Complete 40 credits in Computer science core courses', 40, NULL, 0, NULL),
(18, 'Complete 16 credits in Mathematics courses', 16, NULL, 0, NULL),
(19, 'Computer Science Specialization', NULL, NULL, 1, NULL),
(20, 'Software Engineering', NULL, NULL, 0, NULL),
(21, 'CSCI-B 461 Database Concepts', 3, 1, 0, 1),
(22, 'CSCI-P 465 Software Engineering for Information Systems', 3, 2, 0, 1),
(23, 'Select one course from the following:', 3, NULL, 0, NULL),
(25, 'Select one course from the following:', 3, NULL, 0, NULL),
(26, 'Select one course from the following:', 3, NULL, 0, NULL),
(27, 'Select one additional P course', 3, NULL, 0, NULL),
(28, 'Systems', NULL, NULL, 0, NULL),
(29, 'CSCI-C 291 System Programming with C and Unix', 3, 3, 0, 1),
(30, 'CSCI-C 335 Computer Structures', 3, 4, 0, 1),
(31, 'Select one project course from the following:', 3, NULL, 0, NULL),
(33, 'Select one additional systems course from the following (Not used for project course):', 3, NULL, 0, NULL),
(34, 'Select one course from the following:', 3, NULL, 0, NULL);

-- Insert data into node prerequisites
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES
(1, 3),
(1, 17),
(1, 18),
(1, 19),
(3, 4),
(3, 15),
(3, 16),
(19, 20),
(19, 28);

-- Insert data into node attribute mapping
INSERT INTO node_attribute_mapping (node_id, attribute_id) VALUES
(5, 6),
(6, 8),
(7, 1),
(8, 2),
(9, 5),
(10, 4),
(10, 3);

-- Insert data into node course mapping
INSERT INTO node_course_mapping (node_id, course_id) VALUES
(21, 1),
(22, 2);
