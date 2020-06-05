CREATE TABLE users
(
  id INT NOT NULL AUTO_INCREMENT,
  role varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE courses
(
  id INT NOT NULL AUTO_INCREMENT,
  sub varchar(255) NOT NULL,
  courseNumber INT NOT NULL,
  title varchar(255) NOT NULL,
  instructor varchar(255) NOT NULL,
  instructorId INT NOT NULL,
  term varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE assignment
(
  id INT NOT NULL AUTO_INCREMENT,
  title varchar(255) NOT NULL,
  due DATE NOT NULL,
  points varchar(255) NOT NULL,
  courseId INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT `assignment_ibfk_1` FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE submissions
(
  id INT NOT NULL AUTO_INCREMENT,
  submittedTime TIMESTAMP NOT NULL,
  file varchar(255) NOT NULL,
  assignmentId INT NOT NULL,
  studentId INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (assignmentId) REFERENCES assignment(id) ON DELETE CASCADE,
  FOREIGN KEY (studentId) REFERENCES courses(id)
);

CREATE TABLE takes
(
  courseId INT NOT NULL,
  studentId INT NOT NULL,
  PRIMARY KEY (id, id),
  FOREIGN KEY (courseId) REFERENCES courses(id),
  FOREIGN KEY (studentId) REFERENCES users(id)
);
