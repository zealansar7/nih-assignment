-- Seed Courses
INSERT INTO courses (course_name, description, credits) VALUES ('Mathematics', 'Advanced Mathematics', 4);
INSERT INTO courses (course_name, description, credits) VALUES ('Physics', 'Introduction to Physics', 3);
INSERT INTO courses (course_name, description, credits) VALUES ('Computer Science', 'Data Structures and Algorithms', 4);
INSERT INTO courses (course_name, description, credits) VALUES ('English', 'English Literature', 2);
INSERT INTO courses (course_name, description, credits) VALUES ('History', 'World History', 3);

-- Seed Students
INSERT INTO students (first_name, last_name, email, date_of_birth) VALUES ('John', 'Doe', 'john.doe@example.com', '2000-05-15');
INSERT INTO students (first_name, last_name, email, date_of_birth) VALUES ('Jane', 'Smith', 'jane.smith@example.com', '1999-08-22');
INSERT INTO students (first_name, last_name, email, date_of_birth) VALUES ('Bob', 'Johnson', 'bob.johnson@example.com', '2001-01-10');

-- Enroll students in courses
INSERT INTO student_course (student_id, course_id) VALUES (1, 1);
INSERT INTO student_course (student_id, course_id) VALUES (1, 3);
INSERT INTO student_course (student_id, course_id) VALUES (2, 2);
INSERT INTO student_course (student_id, course_id) VALUES (2, 4);
INSERT INTO student_course (student_id, course_id) VALUES (3, 1);
INSERT INTO student_course (student_id, course_id) VALUES (3, 5);
