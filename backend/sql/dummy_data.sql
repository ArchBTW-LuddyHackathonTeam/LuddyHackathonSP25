-- *********************************************
-- Insert Course Attributes (based on enum Attribute)
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

-- Nodes without extra columns (only title and dropdown_children)
INSERT INTO nodes (id, title, dropdown_children) VALUES
  (1, 'Computer Science BS', 0),           -- preRecs: [3, 17, 18, 19]
  (3, 'Bachelors of Science', 0),           -- preRecs: [4, 15, 16]
  (4, 'General Education Requirements', 0), -- preRecs: [5, 6, 7, 8, 9, 10]
  (10, 'World Languages & Cultures Requirement', 1), -- preRecs: [11, 12, 13]
  (19, 'Computer Science Specialization', 1);        -- preRecs: [20, 28]

-- Nodes with a number value
INSERT INTO nodes (id, title, number) VALUES
  (5, 'Complete One English Composition Course', 1),  -- attributes: ["EC"]
  (6, 'Complete One Mathematical Modeling Course', 1),  -- attributes: ["MM"]
  (7, 'Complete 6 credits of Arts and Humanities courses', 6),  -- attributes: ["AH"]
  (8, 'Complete 6 credits of Social and Historical Studies courses', 6),  -- attributes: ["SH"]
  (9, 'Complete 5 credits of Natural and Mathematical Science courses', 5),  -- attributes: ["NM"]
  (12, 'Complete 6 credits of World Culture courses', 6), -- attributes: ["WC"]
  (15, 'Complete 120 credit hours', 120),
  (17, 'Complete 40 credits in Computer science core courses', 40),
  (18, 'Complete 16 credits in Mathematics courses', 16),
  (23, 'Select one course from the following:', 1),   -- chooseNClasses: [322, 466]
  (25, 'Select one course from the following:', 1),   -- chooseNClasses: [323, 335]
  (26, 'Select one course from the following:', 1),   -- chooseNClasses: [403, 414, 423, 436]
  (31, 'Select one project course from the following:', 1), -- chooseNClasses: [436, 438, 442, 545]
  (33, 'Select one additional systems course from the following (Not used for project course):', 1), -- chooseNClasses: [434, 436, 438, 441, 442, 443, 490, 545]
  (34, 'Select one course from the following:', 1);   -- chooseNClasses: [401, 403, 405]

-- Nodes with course IDs
INSERT INTO nodes (id, title, course_id) VALUES
  (21, 'CSCI-B 461 Database Concepts', 461),
  (22, 'CSCI-P 465 Software Engineering for Information Systems', 465),
  (29, 'CSCI-C 291 System Programming with C and Unix', 291),
  (30, 'CSCI-C 335 Computer Structures', 335);

-- Nodes with only title (no additional columns)
INSERT INTO nodes (id, title) VALUES
  (11, 'Language Study'),
  (13, 'Study Abroad Program'),
  (16, 'Complete 36 credits at 300-400 level'),
  (20, 'Software Engineering'),
  (27, 'Select one additional P course'),
  (28, 'Systems');

-- *********************************************
-- Insert Node Prerequisites (each row: node_id requires prerequisite_node_id)
-- *********************************************
INSERT INTO node_prerequisites (node_id, prerequisite_node_id) VALUES
  -- For Node 1 (preRecs: [3, 17, 18, 19])
  (1, 3), (1, 17), (1, 18), (1, 19),
  -- For Node 3 (preRecs: [4, 15, 16])
  (3, 4), (3, 15), (3, 16),
  -- For Node 4 (preRecs: [5, 6, 7, 8, 9, 10])
  (4, 5), (4, 6), (4, 7), (4, 8), (4, 9), (4, 10),
  -- For Node 10 (preRecs: [11, 12, 13])
  (10, 11), (10, 12), (10, 13),
  -- For Node 19 (preRecs: [20, 28])
  (19, 20), (19, 28),
  -- For Node 20 (preRecs: [21, 22, 23, 25, 26, 27])
  (20, 21), (20, 22), (20, 23), (20, 25), (20, 26), (20, 27),
  -- For Node 28 (preRecs: [29, 30, 31, 33, 34])
  (28, 29), (28, 30), (28, 31), (28, 33), (28, 34);

-- *********************************************
-- Insert Node Attribute Mapping (for nodes with attributes)
-- *********************************************
INSERT INTO node_attribute_mapping (node_id, attribute_id) VALUES
  -- Node 5: attributes ["EC"] --> English Composition (id=7)
  (5, 7),
  -- Node 6: attributes ["MM"] --> Mathematical Modeling (id=8)
  (6, 8),
  -- Node 7: attributes ["AH"] --> A&H (id=1)
  (7, 1),
  -- Node 8: attributes ["SH"] --> S&H (id=2)
  (8, 2),
  -- Node 9: attributes ["NM"] --> N&M (id=5)
  (9, 5),
  -- Node 11: attributes ["WL"] --> World Language (id=4)
  (11, 4),
  -- Node 12: attributes ["WC"] --> World Culture (id=3)
  (12, 3);

-- *********************************************
-- Insert Node Course Mapping (for nodes with chooseNClasses)
-- *********************************************
INSERT INTO node_course_mapping (node_id, course_id) VALUES
  -- Node 23: chooseNClasses: [322, 466]
  (23, 322), (23, 466),
  -- Node 25: chooseNClasses: [323, 335]
  (25, 323), (25, 335),
  -- Node 26: chooseNClasses: [403, 414, 423, 436]
  (26, 403), (26, 414), (26, 423), (26, 436),
  -- Node 31: chooseNClasses: [436, 438, 442, 545]
  (31, 436), (31, 438), (31, 442), (31, 545),
  -- Node 33: chooseNClasses: [434, 436, 438, 441, 442, 443, 490, 545]
  (33, 434), (33, 436), (33, 438), (33, 441), (33, 442), (33, 443), (33, 490), (33, 545),
  -- Node 34: chooseNClasses: [401, 403, 405]
  (34, 401), (34, 403), (34, 405);
