CREATE TABLE users
(
  id INT NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  role varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE courses
(
  id INT NOT NULL AUTO_INCREMENT,
  subject varchar(255) NOT NULL,
  number INT NOT NULL,
  title varchar(255) NOT NULL,
  term varchar(255) NOT NULL,
  instructorId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (instructorId) REFERENCES users(id)
);

CREATE TABLE assignments
(
  id INT NOT NULL AUTO_INCREMENT,
  courseId INT NOT NULL,
  title varchar(255) NOT NULL,
  points varchar(255) NOT NULL,
  due varchar(255) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE submissions
(
  id INT NOT NULL AUTO_INCREMENT,
  assignmentId INT NOT NULL,
  studentId INT NOT NULL,
  submittedTime varchar(255) NOT NULL,
  fileDownload varchar(255) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (studentId) REFERENCES users(id),
  FOREIGN KEY (assignmentId) REFERENCES assignments(id) ON DELETE CASCADE
);

CREATE TABLE student_courses
(
  id INT NOT NULL AUTO_INCREMENT,
  courseId INT NOT NULL,
  studentId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (studentId) REFERENCES users(id)
);
