-- =====================================================
-- TRIGGERS
-- =====================================================

USE dropout_reentry_db;

DELIMITER //

-- Trigger: After Student Insert - Generate Enrollment Number
CREATE TRIGGER trg_student_enrollment_number
BEFORE INSERT ON students
FOR EACH ROW
BEGIN
    DECLARE v_count INT;
    DECLARE v_year VARCHAR(4);
    SET v_year = YEAR(CURDATE());
    SELECT COUNT(*) + 1 INTO v_count FROM students WHERE YEAR(created_at) = v_year;
    IF NEW.enrollment_number IS NULL THEN
        SET NEW.enrollment_number = CONCAT('STU', v_year, LPAD(v_count, 6, '0'));
    END IF;
END //

-- Trigger: After Dropout Insert - Create Notification
CREATE TRIGGER trg_dropout_notification
AFTER INSERT ON dropouts
FOR EACH ROW
BEGIN
    INSERT INTO notifications (user_id, title, message, type, category, reference_type, reference_id)
    SELECT user_id, 'New Dropout Recorded',
           CONCAT('A new dropout has been recorded. Dropout ID: ', NEW.dropout_id),
           'warning', 'enrollment', 'dropout', NEW.dropout_id
    FROM users WHERE role = 'admin';
END //

-- Trigger: After Enrollment Complete - Update Stats
CREATE TRIGGER trg_enrollment_complete
AFTER UPDATE ON enrollments
FOR EACH ROW
BEGIN
    DECLARE v_student_id INT;
    IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
        SELECT student_id INTO v_student_id FROM dropouts WHERE dropout_id = NEW.dropout_id;
        UPDATE students SET status = 'completed' WHERE student_id = v_student_id;
        UPDATE dropouts SET status = 'reentry_completed' WHERE dropout_id = NEW.dropout_id;
        IF NEW.counselor_id IS NOT NULL THEN
            UPDATE counselors c SET
                success_rate = (SELECT COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM enrollments WHERE counselor_id = c.counselor_id), 0) FROM enrollments WHERE counselor_id = c.counselor_id AND status = 'completed'),
                current_students = current_students - 1
            WHERE counselor_id = NEW.counselor_id;
        END IF;
        UPDATE pathways p SET success_rate = (SELECT COUNT(*) * 100.0 / NULLIF(p.current_enrollment, 0) FROM enrollments WHERE pathway_id = p.pathway_id AND status = 'completed') WHERE pathway_id = NEW.pathway_id;
        INSERT INTO notifications (user_id, title, message, type, category, reference_type, reference_id)
        SELECT user_id, 'Pathway Completed!', 'Congratulations! You have successfully completed the pathway.',
               'success', 'progress', 'enrollment', NEW.enrollment_id
        FROM students WHERE student_id = v_student_id AND user_id IS NOT NULL;
    END IF;
END //

-- Trigger: Audit Log for Users
CREATE TRIGGER trg_users_audit_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (NEW.user_id, 'UPDATE', 'users', NEW.user_id,
        JSON_OBJECT('email', OLD.email, 'role', OLD.role, 'is_active', OLD.is_active),
        JSON_OBJECT('email', NEW.email, 'role', NEW.role, 'is_active', NEW.is_active));
END //

-- Trigger: Session Rating Update Counselor
CREATE TRIGGER trg_session_rating
AFTER UPDATE ON counseling_sessions
FOR EACH ROW
BEGIN
    IF NEW.student_rating IS NOT NULL AND (OLD.student_rating IS NULL OR OLD.student_rating != NEW.student_rating) THEN
        UPDATE counselors c SET
            rating = (SELECT AVG(student_rating) FROM counseling_sessions WHERE counselor_id = c.counselor_id AND student_rating IS NOT NULL),
            total_reviews = (SELECT COUNT(*) FROM counseling_sessions WHERE counselor_id = c.counselor_id AND student_rating IS NOT NULL)
        WHERE counselor_id = NEW.counselor_id;
    END IF;
END //

DELIMITER ;
