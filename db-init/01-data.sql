-- Add users (creds in README.md)
INSERT INTO users (name, email, password, role) VALUES ('Test Admin', 'admin@school.dev', '$2a$08$PmdVLUm.O1lOnaCEHnDkFOuGS03Ns6PwFphwzLxkIbU/lzQvoEy/6', 'admin');
INSERT INTO users (name, email, password, role) VALUES ('Test Instructor', 'instructor@school.dev', '$2a$08$xe.MOAqFZEhiVjzodf04fe4jytwBidumA8zbjrik.g/xKdSeiyZfC', 'instructor');
INSERT INTO users (name, email, password, role) VALUES ('Test Student', 'student@school.dev', '$2a$08$EXSZIX2YeU3ImA1oJ9yVs.TLz4fkLiX/7cwXNPtuuivGglAlwGD/G', 'student');
INSERT INTO users (name, email, password, role) VALUES ('Test Student2', 'student2@school.dev', '$2a$08$EXSZIX2YeU3ImA1oJ9yVs.TLz4fkLiX/7cwXNPtuuivGglAlwGD/G', 'student');
INSERT INTO users (name, email, password, role) VALUES ('Test Student3', 'student3@school.dev', '$2a$08$EXSZIX2YeU3ImA1oJ9yVs.TLz4fkLiX/7cwXNPtuuivGglAlwGD/G', 'student');
INSERT INTO courses (id, subject, number, title, term, instructorId) VALUES (1, "CS", 493, "test course", "spring", 2);
INSERT INTO student_courses (courseId, studentId) VALUES (1, 3), (1,4), (1,5);
