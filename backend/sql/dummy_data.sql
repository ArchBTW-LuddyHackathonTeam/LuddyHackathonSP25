-- Insert dummy departments
INSERT INTO departments (name, abbreviation, description) VALUES 
  ('Computer Science', 'CS', 'Department of Computer Science'),
  ('Mathematics', 'MATH', 'Department of Mathematics'),
  ('Physics', 'PHY', 'Department of Physics');

-- Insert dummy instructors
INSERT INTO instructors (name, department_id) VALUES
  ('Alice Smith', 1),
  ('Bob Johnson', 2),
  ('Charlie Brown', 1),
  ('Dana White', 3);

-- Insert dummy instructor reviews
INSERT INTO instructor_reviews (instructor_id, quality_score, difficulty_score, review) VALUES
  (1, 5, 3, 'Excellent teaching with clear explanations.'),
  (1, 4, 4, 'Very approachable and knowledgeable.'),
  (2, 3, 5, 'Challenging course, but very rewarding.'),
  (3, 4, 2, 'Engaging lectures and supportive office hours.'),
  (4, 5, 4, 'Highly recommended for students interested in physics.');

-- Insert dummy office hours
INSERT INTO office_hours (instructor_id, days_of_week, time_of_day, type) VALUES
  (1, 'Monday,Wednesday', '2:00 PM - 3:00 PM', 'In-person'),
  (2, 'Tuesday', '10:00 AM - 12:00 PM', 'Virtual'),
  (3, 'Thursday', '1:00 PM - 2:00 PM', 'In-person'),
  (4, 'Friday', '3:00 PM - 5:00 PM', 'In-person');

-- Insert dummy sections (existing)
INSERT INTO sections (days_of_week, time_of_day, type) VALUES
  ('Monday,Wednesday,Friday', '9:00 AM - 10:00 AM', 'Lecture'),
  ('Tuesday,Thursday', '1:00 PM - 2:30 PM', 'Lab'),
  ('Monday,Wednesday', '11:00 AM - 12:30 PM', 'Lecture');

-- Insert additional sections for new courses
INSERT INTO sections (days_of_week, time_of_day, type) VALUES
  ('Tuesday,Thursday', '3:00 PM - 4:30 PM', 'Lecture'),
  ('Monday,Wednesday,Friday', '1:00 PM - 2:00 PM', 'Lecture');

-- Insert dummy courses (original set)
INSERT INTO courses (department_id, course_code, instruction_mode, terms_offered, credits, description, instructor_id) VALUES
  (1, 'CS101', 'In-person', 'Fall,Spring', 3, 'Introduction to Computer Science', 1),
  (1, 'CS201', 'Hybrid', 'Fall', 4, 'Data Structures and Algorithms', 3),
  (2, 'MATH101', 'In-person', 'Fall,Spring', 3, 'Calculus I', 2),
  (3, 'PHY101', 'Virtual', 'Spring', 4, 'Fundamentals of Physics', 4);

-- Insert new courses to enhance prerequisite testing
-- Note: IDs for new courses will auto-increment; assuming the original courses got IDs 1-4, these become 5 and onward.
INSERT INTO courses (department_id, course_code, instruction_mode, terms_offered, credits, description, instructor_id) VALUES
  (1, 'CS301', 'In-person', 'Fall', 3, 'Advanced Algorithms', 1),        -- ID 5
  (1, 'CS401', 'Hybrid', 'Spring', 4, 'Machine Learning', 3),              -- ID 6
  (2, 'MATH201', 'In-person', 'Fall,Spring', 3, 'Linear Algebra', 2),        -- ID 7
  (2, 'MATH301', 'In-person', 'Spring', 3, 'Differential Equations', 2),     -- ID 8
  (3, 'PHY201', 'Virtual', 'Fall', 4, 'Quantum Physics', 4);               -- ID 9

-- Insert dummy course_sections (original mappings)
INSERT INTO course_sections (course_id, section_id) VALUES
  (1, 1),
  (1, 3),
  (2, 1),
  (3, 2),
  (4, 3);

-- Map new courses to sections (using newly inserted section IDs 4 and 5 along with some existing ones)
INSERT INTO course_sections (course_id, section_id) VALUES
  (5, 4),   -- CS301 with new Lecture section
  (6, 5),   -- CS401 with new Lecture section
  (7, 4),   -- MATH201 using section 4
  (8, 1),   -- MATH301 using existing Lecture
  (9, 5);   -- PHY201 using section 5

-- Insert dummy course_prerequisites (original prerequisites)
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES
  (2, 1),   -- CS201 requires CS101
  (4, 3);   -- PHY101 requires MATH101

-- Insert additional course prerequisites for new courses
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES
  (5, 2),   -- CS301 requires CS201
  (6, 2),   -- CS401 requires CS201
  (6, 3),   -- CS401 also requires MATH101
  (7, 3),   -- MATH201 requires MATH101
  (8, 7),   -- MATH301 requires MATH201
  (9, 4),   -- PHY201 requires PHY101
  (9, 7);   -- PHY201 also requires MATH201

-- Insert dummy course attributes
INSERT INTO course_attributes (name, description) VALUES
  ('Lab Required', 'This course includes a lab component'),
  ('Writing Intensive', 'Significant writing assignments included'),
  ('Project Based', 'Course involves group projects and presentations');

-- Map courses to attributes
INSERT INTO course_attribute_mapping (course_id, attribute_id) VALUES
  (1, 3),    -- CS101: Project Based
  (2, 1),    -- CS201: Lab Required
  (2, 3),    -- CS201: Project Based
  (3, 2),    -- MATH101: Writing Intensive
  (4, 1),    -- PHY101: Lab Required
  (6, 3),    -- CS401: Project Based
  (7, 1);    -- MATH201: Lab Required

-- Insert dummy nodes (e.g., representing degrees or programs)
INSERT INTO nodes (id, title) VALUES
  (1, 'Bachelor of Science in Computer Science'),
  (2, 'Bachelor of Science in Mathematics'),
  (3, 'Master of Science in Physics');

-- Insert dummy node prerequisites (e.g., a master's program requiring bachelor's degrees)
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES
  (3, 1),
  (3, 2);

