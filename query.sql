-- drop table attendance;
CREATE TABLE attendance (
    student_id VARCHAR(4),
    date DATE,
    period VARCHAR(5),
    attendance_status VARCHAR(1),
    time TIME,
    PRIMARY KEY (student_id, date, period)
);
INSERT INTO attendance (student_id, date, period, attendance_status, time)
VALUES 
('2A01', '2/1/2025', 'II-1', '△','10:00:20'),
-- ('2A01', '2/1/2025', 'II-1', '〇', NULL),
('2A01', '2/2/2025', 'II-1', '△','15:15:30'),
('2A01', '2/2/2025', 'II-2', '〇', NULL);

SELECT * FROM attendance;


-- SELECT * FROM timetable WHERE date LIKE '2/%/2025' AND num = 'two';