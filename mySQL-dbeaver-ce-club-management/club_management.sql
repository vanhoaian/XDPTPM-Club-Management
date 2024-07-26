# Drop database sums if it exists already
DROP DATABASE IF EXISTS club_management;

# Create database
CREATE DATABASE club_management;

# Choose database
USE club_management;

# UTF-8 encode
SET NAMES 'utf8';

-- Bảng Câu lạc bộ (Club)
DROP TABLE IF EXISTS Club;
CREATE TABLE Club (
    club_id VARCHAR(20) PRIMARY KEY,
    club_name VARCHAR(100) NOT NULL,
    description TEXT,
    date_established DATE
);

-- Bảng Thành viên (Member)
DROP TABLE IF EXISTS Member;
CREATE TABLE Member (
    member_id VARCHAR(25) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    date_of_birth DATE,
    password VARCHAR(20),
    club_id VARCHAR(20) REFERENCES Club(club_id)
);


DELIMITER $$

CREATE TRIGGER set_default_password_and_member_id
BEFORE INSERT ON Member
FOR EACH ROW
BEGIN
    -- Generate MemberID in the format clubId-001
    DECLARE last_member_id VARCHAR(25);
    DECLARE new_id INT;

    -- Get the last MemberID for the given ClubID
    SELECT member_id INTO last_member_id
    FROM Member
    WHERE club_id = NEW.club_id
    ORDER BY member_id DESC
    LIMIT 1;

    IF last_member_id IS NULL THEN
        -- If there are no members yet, start with 001
        SET new_id = 1;
    ELSE
        -- Extract the numeric part of the last MemberID and increment it
        SET new_id = CAST(SUBSTRING_INDEX(last_member_id, '-', -1) AS UNSIGNED) + 1;
    END IF;

    -- Create the new MemberID
    SET NEW.member_id = CONCAT(NEW.club_id, '-', LPAD(new_id, 3, '0'));

    -- Set Password as DateOfBirth in dd/mm/yy format
    SET NEW.password = DATE_FORMAT(NEW.date_of_birth, '%d/%m/%y');
END $$

DELIMITER ;

-- Bảng Admin
DROP TABLE IF EXISTS Admin;
CREATE TABLE Admin (
    admin_id VARCHAR(20) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    club_id VARCHAR(20),
    FOREIGN KEY (club_id) REFERENCES Club(club_id)
);

-- Bảng Sự kiện (Event)
DROP TABLE IF EXISTS  Event;
CREATE TABLE Event (
    envet_id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_time DATETIME,
    end_time DATETIME,
    club_id VARCHAR(20),
    FOREIGN KEY (club_id) REFERENCES Club(club_id)
);

-- Bảng Tham gia Sự kiện (EventParticipation)
DROP TABLE IF EXISTS event_participation;
CREATE TABLE EventParticipation (
    participation_id INT AUTO_INCREMENT PRIMARY KEY,
    status ENUM('Tham gia', 'Nghỉ phép', 'Phép muốn'),
    member_id VARCHAR(20) REFERENCES Member(member_id),
    event_id INT REFERENCES Event(event_id)
);

-- Bảng Cảnh báo (Alert)
DROP TABLE IF EXISTS Alert;
CREATE TABLE Alert (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT,
    alert_date DATETIME,
    member_id VARCHAR(20) REFERENCES Member(member_id)
);

-- Bảng Thông báo (Notification)
DROP TABLE IF EXISTS Notification;
CREATE TABLE Notification (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT,
    sent_to VARCHAR(25),
    sent_date DATETIME,
    FOREIGN KEY (sent_to) REFERENCES Member(member_id)
);



INSERT INTO Club (club_id, club_name, description, date_established)
VALUES ('CLB001', 'IT Club', 'A club for IT enthusiasts', '2024-01-01');

-- Insert data into Member table
INSERT INTO Member (name, email, phone_number, date_of_birth, club_id)
VALUES ('John Doe', 'john.doe@example.com', '1234567890', '1990-01-01', 'CLB001');

INSERT INTO Admin (admin_id, username, password, name, email, phone_number, club_id)
VALUES ('CLB001', 'admin_itclub', 'securepassword', 'John Admin', 'admin@itclub.com', '1234567890', 'CLB001');

INSERT INTO Event (event_name, description, location, start_time, end_time, club_id)
VALUES ('Công nghệ tương lai', 'Sự kiện về công nghệ mới', 'Hội trường A', '2024-08-01 09:00:00', '2024-08-01 12:00:00', 'CLB001');

INSERT INTO EventParticipation (member_id, event_id, status)
VALUES (1, 1, 'Tham gia');



