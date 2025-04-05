
-- === Dummy Data Inserts ===

-- 1. Insert Departments
INSERT INTO departments (name, description) VALUES 
  ('Computer Science', 'CS department offering courses in programming and theory.'),
  ('Mathematics', 'Math department covering algebra, calculus, and statistics.');

-- 2. Insert Instructors (department_id references departments; here Computer Science is id 1, Mathematics is id 2)
INSERT INTO instructors (name, department_id) VALUES
  ('Dr. Jane Doe', 1),
  ('Prof. John Smith', 2);

-- 3. Insert Instructor Reviews (instructor_id references instructors)
INSERT INTO instructor_reviews (instructor_id, review) VALUES
  (1, 'Excellent teacher with clear explanations.'),
  (1, 'Inspires students to learn.'),
  (2, 'Engaging lectures that challenge students.'),
  (2, 'Provides thorough feedback on assignments.');

-- 4. Insert Office Hours (instructor_id references instructors)
INSERT INTO office_hours (instructor_id, days_of_week, time_of_day, type) VALUES
  (1, 'Tuesday', '2:00 PM - 4:00 PM', 'Office Hours'),
  (2, 'Thursday', '3:00 PM - 5:00 PM', 'Office Hours');

-- 5. Insert Sections
INSERT INTO sections (days_of_week, time_of_day, type) VALUES
  ('Monday,Wednesday', '10:00 AM - 11:30 AM', 'Lecture'),
  ('Friday', '1:00 PM - 2:30 PM', 'Lab'),
  ('Tuesday,Thursday', '9:00 AM - 10:30 AM', 'Lecture');

-- 6. Insert Courses
-- department_id and instructor_id reference departments and instructors respectively.
INSERT INTO courses (department_id, course_code, instruction_node, terms_offered, credits, description, instructor_id) VALUES
  (1, 'CS101', 'Introduction to Computer Science fundamentals', 'Fall,Spring', 3, 'Covers basics of programming, algorithms, and problem solving.', 1),
  (2, 'MATH101', 'Calculus I: Differential Calculus', 'Fall', 4, 'Introduction to limits, derivatives, and integrals.', 2);

-- 7. Map Courses to Sections (course_id and section_id reference courses and sections)
-- Assume course 1 (CS101) is offered in two sections and course 2 (MATH101) is offered in one section.
INSERT INTO course_sections (course_id, section_id) VALUES
  (1, 1),
  (1, 2),
  (2, 3);

-- 8. Insert Course Prerequisites (self-referencing the courses table)
-- For demonstration, assume MATH101 (course id 2) has CS101 (course id 1) as a prerequisite.
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES
  (2, 1);

-- 9. Insert Course Attributes
INSERT INTO course_attributes (name, description) VALUES
  ('A&H', 'Arts & Humanities credit'),
  ('S&H', 'Social & Humanities credit'),
  ('GenEd', 'General Education credit');

-- 10. Map Courses to Attributes (course_id references courses; attribute_id references course_attributes)
-- For example, map CS101 to A&H (id 1) and GenEd (id 3), and MATH101 to S&H (id 2).
INSERT INTO course_attribute_mapping (course_id, attribute_id) VALUES
  (1, 1),
  (1, 3),
  (2, 2);