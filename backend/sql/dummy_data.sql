-- *********************************************
-- New Course Attributes based on enum Attribute:
-- AH = "A&H", SH = "S&H", WC = "World Culture",
-- WL = "World Language", NM = "N&M", IW = "Intensive Writing",
-- EC = "English Composition", MM = "Mathematical Modeling"
-- *********************************************
INSERT INTO course_attributes (id, name, description) VALUES
  (1, 'A&H', 'Arts & Humanities requirement'),
  (2, 'S&H', 'Social & Historical Studies requirement'),
  (3, 'World Culture', 'World Culture requirement'),
  (4, 'World Language', 'World Language requirement'),
  (5, 'N&M', 'Natural & Mathematical Sciences requirement'),
  (6, 'Intensive Writing', 'Intensive Writing requirement'),
  (7, 'English Composition', 'English Composition requirement'),
  (8, 'Mathematical Modeling', 'Mathematical Modeling requirement');

-- *********************************************
-- Insert Nodes for the degree/program and requirements hierarchy
-- (Mapping JSON keys: id, titleValue, numberValue, courseID, dropdownChildren)
-- *********************************************

-- Node 1: Computer Science BS (preRecs: [3, 17, 18, 19])
INSERT INTO nodes (id, title, dropdown_children) VALUES
  (1, 'Computer Science BS', 0);

-- Node 3: Bachelors of Science (preRecs: [4, 15, 16])
INSERT INTO nodes (id, title, dropdown_children) VALUES
  (3, 'Bachelors of Science', 0);

-- Node 4: General Education Requirements (preRecs: [5, 6, 7, 8, 9, 10])
INSERT INTO nodes (id, title, dropdown_children) VALUES
  (4, 'General Education Requirements', 0);

-- Node 5: Complete One English Composition Course (numberValue: 1, attributes: ["EC"])
INSERT INTO nodes (id, title, number) VALUES
  (5, 'Complete One English Composition Course', 1);

-- Node 6: Complete One Mathematical Modeling Course (numberValue: 1, attributes: ["MM"])
INSERT INTO nodes (id, title, number) VALUES
  (6, 'Complete One Mathematical Modeling Course', 1);

-- Node 7: Complete 6 credits of Arts and Humanities courses (numberValue: 6, attributes: ["AH"])
INSERT INTO nodes (id, title, number) VALUES
  (7, 'Complete 6 credits of Arts and Humanities courses', 6);

-- Node 8: Complete 6 credits of Social and Historical Studies courses (numberValue: 6, attributes: ["SH"])
INSERT INTO nodes (id, title, number) VALUES
  (8, 'Complete 6 credits of Social and Historical Studies courses', 6);

-- Node 9: Complete 5 credits of Natural and Mathematical Science courses (numberValue: 5, attributes: ["NM"])
INSERT INTO nodes (id, title, number) VALUES
  (9, 'Complete 5 credits of Natural and Mathematical Science courses', 5);

-- Node 10: World Languages & Cultures Requirement (dropdownChildren: true, preRecs: [11, 12, 13])
INSERT INTO nodes (id, title, dropdown_children) VALUES
  (10, 'World Languages & Cultures Requirement', 1);

-- Node 11: Language Study (attributes: ["WL"])
INSERT INTO nodes (id, title) VALUES
  (11, 'Language Study');

-- Node 12: Complete 6 credits of World Culture courses (numberValue: 6, attributes: ["WC"])
INSERT INTO nodes (id, title, number) VALUES
  (12, 'Complete 6 credits of World Culture courses', 6);

-- Node 13: Study Abroad Program
INSERT INTO nodes (id, title) VALUES
  (13, 'Study Abroad Program');

-- Node 15: Complete 120 credit hours (numberValue: 120)
INSERT INTO nodes (id, title, number) VALUES
  (15, 'Complete 120 credit hours', 120);

-- Node 16: Complete 36 credits at 300-400 level
INSERT INTO nodes (id, title) VALUES
  (16, 'Complete 36 credits at 300-400 level');

-- Node 17: Complete 40 credits in Computer science core courses (numberValue: 40)
INSERT INTO nodes (id, title, number) VALUES
  (17, 'Complete 40 credits in Computer science core courses', 40);

-- Node 18: Complete 16 credits in Mathematics courses (numberValue: 16)
INSERT INTO nodes (id, title, number) VALUES
  (18, 'Complete 16 credits in Mathematics courses', 16);

-- Node 19: Computer Science Specialization (dropdownChildren: true, preRecs: [20, 28])
INSERT INTO nodes (id, title, dropdown_children) VALUES
  (19, 'Computer Science Specialization', 1);

-- Node 20: Software Engineering (preRecs: [21, 22, 23, 25, 26, 27])
INSERT INTO nodes (id, title) VALUES
  (20, 'Software Engineering');

-- Node 21: CSCI-B 461 Database Concepts (courseID: 461)
INSERT INTO nodes (id, title, course_id) VALUES
  (21, 'CSCI-B 461 Database Concepts', 461);

-- Node 22: CSCI-P 465 Software Engineering for Information Systems (courseID: 465)
INSERT INTO nodes (id, title, course_id) VALUES
  (22, 'CSCI-P 465 Software Engineering for Information Systems', 465);

-- Node 23: Select one course from the following: (numberValue: 1, chooseNClasses: [322, 466])
INSERT INTO nodes (id, title, number) VALUES
  (23, 'Select one course from the following:', 1);

-- Node 25: Select one course from the following: (numberValue: 1, chooseNClasses: [323, 335])
INSERT INTO nodes (id, title, number) VALUES
  (25, 'Select one course from the following:', 1);

-- Node 26: Select one course from the following: (numberValue: 1, chooseNClasses: [403, 414, 423, 436])
INSERT INTO nodes (id, title, number) VALUES
  (26, 'Select one course from the following:', 1);

-- Node 27: Select one additional P course
INSERT INTO nodes (id, title) VALUES
  (27, 'Select one additional P course');

-- Node 28: Systems (preRecs: [29, 30, 31, 33, 34])
INSERT INTO nodes (id, title) VALUES
  (28, 'Systems');

-- Node 29: CSCI-C 291 System Programming with C and Unix (courseID: 291)
INSERT INTO nodes (id, title, course_id) VALUES
  (29, 'CSCI-C 291 System Programming with C and Unix', 291);

-- Node 30: CSCI-C 335 Computer Structures (courseID: 335)
INSERT INTO nodes (id, title, course_id) VALUES
  (30, 'CSCI-C 335 Computer Structures', 335);

-- Node 31: Select one project course from the following: (numberValue: 1, chooseNClasses: [436, 438, 442, 545])
INSERT INTO nodes (id, title, number) VALUES
  (31, 'Select one project course from the following:', 1);

-- Node 33: Select one additional systems course from the following (Not used for project course): 
-- (numberValue: 1, chooseNClasses: [434, 436, 438, 441, 442, 443, 490, 545])
INSERT INTO nodes (id, title, number) VALUES
  (33, 'Select one additional systems course from the following (Not used for project course):', 1);

-- Node 34: Select one course from the following: (numberValue: 1, chooseNClasses: [401, 403, 405])
INSERT INTO nodes (id, title, number) VALUES
  (34, 'Select one course from the following:', 1);

-- *********************************************
-- Insert Node Prerequisites (each row: node_id requires prerequisite_node_id)
-- *********************************************

-- For Node 1 (preRecs: [3, 17, 18, 19])
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (1, 3);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (1, 17);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (1, 18);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (1, 19);

-- For Node 3 (preRecs: [4, 15, 16])
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (3, 4);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (3, 15);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (3, 16);

-- For Node 4 (preRecs: [5, 6, 7, 8, 9, 10])
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (4, 5);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (4, 6);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (4, 7);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (4, 8);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (4, 9);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (4, 10);

-- For Node 10 (preRecs: [11, 12, 13])
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (10, 11);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (10, 12);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (10, 13);

-- For Node 19 (preRecs: [20, 28])
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (19, 20);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (19, 28);

-- For Node 20 (preRecs: [21, 22, 23, 25, 26, 27])
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (20, 21);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (20, 22);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (20, 23);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (20, 25);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (20, 26);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (20, 27);

-- For Node 28 (preRecs: [29, 30, 31, 33, 34])
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (28, 29);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (28, 30);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (28, 31);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (28, 33);
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES (28, 34);

-- *********************************************
-- Insert Node Attribute Mapping (for nodes with attributes)
-- *********************************************

-- Node 5: attributes ["EC"] --> English Composition (id=7)
INSERT INTO node_attribute_mapping (node_id, attribute_id) VALUES (5, 7);

-- Node 6: attributes ["MM"] --> Mathematical Modeling (id=8)
INSERT INTO node_attribute_mapping (node_id, attribute_id) VALUES (6, 8);

-- Node 7: attributes ["AH"] --> A&H (id=1)
INSERT INTO node_attribute_mapping (node_id, attribute_id) VALUES (7, 1);

-- Node 8: attributes ["SH"] --> S&H (id=2)
INSERT INTO node_attribute_mapping (node_id, attribute_id) VALUES (8, 2);

-- Node 9: attributes ["NM"] --> N&M (id=5)
INSERT INTO node_attribute_mapping (node_id, attribute_id) VALUES (9, 5);

-- Node 11: attributes ["WL"] --> World Language (id=4)
INSERT INTO node_attribute_mapping (node_id, attribute_id) VALUES (11, 4);

-- Node 12: attributes ["WC"] --> World Culture (id=3)
INSERT INTO node_attribute_mapping (node_id, attribute_id) VALUES (12, 3);

-- *********************************************
-- Insert Node Course Mapping (for nodes with chooseNClasses)
-- *********************************************

-- Node 23: chooseNClasses: [322, 466]
INSERT INTO node_course_mapping (node_id, course_id) VALUES (23, 322);
INSERT INTO node_course_mapping (node_id, course_id) VALUES (23, 466);

-- Node 25: chooseNClasses: [323, 335]
INSERT INTO node_course_mapping (node_id, course_id) VALUES (25, 323);
INSERT INTO node_course_mapping (node_id, course_id) VALUES (25, 335);

-- Node 26: chooseNClasses: [403, 414, 423, 436]
INSERT INTO node_course_mapping (node_id, course_id) VALUES (26, 403);
INSERT INTO node_course_mapping (node_id, course_id) VALUES (26, 414);
INSERT INTO node_course_mapping (node_id, course_id) VALUES (26, 423);
INSERT INTO node_course_mapping (node_id, course_id) VALUES (26, 436);

-- Node 31: chooseNClasses: [436, 438, 442, 545]
INSERT INTO node_course_mapping (node_id, course_id) VALUES (31, 436);
INSERT INTO node_course_mapping (node_id, course_id) VALUES (31, 438);
INSERT INTO node_course_mapping (node_id, course_id) VALUES (31, 442);
INSERT INTO node_course_mapping (node_id, course_id) VALUES (31, 545);

-- Node 33: chooseNClasses: [434, 436, 438, 441, 442, 443, 490, 545]
INSERT INTO node_course_mapping (node_id, course_id) VALUES (33, 434);
INSERT INTO node_course_mapping (node_id, course_id) VALUES (33, 436);
INSERT INTO node_course_mapping (node_id, course_id) VALUES (33, 438);
INSERT INTO node_course_mapping (node_id, course_id) VALUES (33, 441);
INSERT INTO node_course_mapping (node_id, course_id) VALUES (33, 442);
INSERT INTO node_course_mapping (node_id, course_id) VALUES (33, 443);
INSERT INTO node_course_mapping (node_id, course_id) VALUES (33, 490);
INSERT INTO node_course_mapping (node_id, course_id) VALUES (33, 545);

-- Node 34: chooseNClasses: [401, 403, 405]
INSERT INTO node_course_mapping (node_id, course_id) VALUES (34, 401);
INSERT INTO node_course_mapping (node_id, course_id) VALUES (34, 403);
INSERT INTO node_course_mapping (node_id, course_id) VALUES (34, 405);
