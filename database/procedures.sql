-- Stored Procedures for Dropout Re-entry Pathway System
USE dropout_reentry_db;

DELIMITER //

CREATE PROCEDURE GetDashboardStats()
BEGIN
    SELECT
        (SELECT COUNT(*) FROM students) as total_students,
        (SELECT COUNT(*) FROM students WHERE status = 'active') as active_students,
        (SELECT COUNT(*) FROM students WHERE status = 'dropout') as total_dropouts,
        (SELECT COUNT(*) FROM dropouts WHERE status = 'enrolled') as enrolled_in_pathway,
        (SELECT COUNT(*) FROM enrollments WHERE status = 'completed') as completed_pathways,
        (SELECT COUNT(*) FROM pathways WHERE is_active = TRUE) as active_pathways;
END //

CREATE PROCEDURE RecordDropout(
    IN p_student_id INT, IN p_institution_id INT, IN p_dropout_date DATE,
    IN p_last_class VARCHAR(20), IN p_last_level VARCHAR(50),
    IN p_primary_reason_id INT, IN p_detailed_reason TEXT,
    IN p_willing_to_return BOOLEAN, IN p_preferred_mode VARCHAR(20)
)
BEGIN
    DECLARE v_dropout_id INT;
    START TRANSACTION;
    UPDATE students SET status = 'dropout' WHERE student_id = p_student_id;
    INSERT INTO dropouts (student_id, institution_id, dropout_date, last_class_attended, last_education_level, primary_reason_id, detailed_reason, willing_to_return, preferred_mode, status)
    VALUES (p_student_id, p_institution_id, p_dropout_date, p_last_class, p_last_level, p_primary_reason_id, p_detailed_reason, p_willing_to_return, p_preferred_mode, 'recorded');
    SET v_dropout_id = LAST_INSERT_ID();
    COMMIT;
    SELECT v_dropout_id as dropout_id, 'Dropout recorded successfully' as message;
END //

CREATE PROCEDURE EnrollInPathway(
    IN p_dropout_id INT, IN p_pathway_id INT, IN p_counselor_id INT,
    IN p_fee_paid DECIMAL(10,2), IN p_scholarship DECIMAL(10,2)
)
BEGIN
    DECLARE v_enrollment_id INT;
    DECLARE v_duration INT;
    DECLARE v_first_module_id INT;
    START TRANSACTION;
    SELECT duration_months INTO v_duration FROM pathways WHERE pathway_id = p_pathway_id;
    SELECT module_id INTO v_first_module_id FROM pathway_modules WHERE pathway_id = p_pathway_id ORDER BY sequence_order LIMIT 1;
    INSERT INTO enrollments (dropout_id, pathway_id, counselor_id, enrollment_date, expected_completion_date, fee_paid, scholarship_received, payment_status, current_module_id, status)
    VALUES (p_dropout_id, p_pathway_id, p_counselor_id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL v_duration MONTH), p_fee_paid, p_scholarship, IF(p_fee_paid > 0, 'partial', 'pending'), v_first_module_id, 'enrolled');
    SET v_enrollment_id = LAST_INSERT_ID();
    UPDATE dropouts SET status = 'enrolled' WHERE dropout_id = p_dropout_id;
    UPDATE students s JOIN dropouts d ON s.student_id = d.student_id SET s.status = 'reentry' WHERE d.dropout_id = p_dropout_id;
    UPDATE pathways SET current_enrollment = current_enrollment + 1 WHERE pathway_id = p_pathway_id;
    IF p_counselor_id IS NOT NULL THEN
        UPDATE counselors SET current_students = current_students + 1 WHERE counselor_id = p_counselor_id;
    END IF;
    COMMIT;
    SELECT v_enrollment_id as enrollment_id, 'Enrollment successful' as message;
END //

CREATE PROCEDURE GetDropoutAnalysis(IN p_start_date DATE, IN p_end_date DATE, IN p_district_id INT)
BEGIN
    SELECT drm.reason_category, drm.reason_name, COUNT(d.dropout_id) as count,
        ROUND(COUNT(d.dropout_id) * 100.0 / (SELECT COUNT(*) FROM dropouts WHERE dropout_date BETWEEN p_start_date AND p_end_date), 2) as percentage
    FROM dropouts d
    JOIN dropout_reasons_master drm ON d.primary_reason_id = drm.reason_id
    JOIN students s ON d.student_id = s.student_id
    WHERE d.dropout_date BETWEEN p_start_date AND p_end_date AND (p_district_id IS NULL OR s.district_id = p_district_id)
    GROUP BY drm.reason_id ORDER BY count DESC;
    
    SELECT last_education_level, COUNT(*) as count FROM dropouts d
    JOIN students s ON d.student_id = s.student_id
    WHERE d.dropout_date BETWEEN p_start_date AND p_end_date AND (p_district_id IS NULL OR s.district_id = p_district_id)
    GROUP BY last_education_level;
    
    SELECT s.gender, COUNT(*) as count FROM dropouts d
    JOIN students s ON d.student_id = s.student_id
    WHERE d.dropout_date BETWEEN p_start_date AND p_end_date AND (p_district_id IS NULL OR s.district_id = p_district_id)
    GROUP BY s.gender;
    
    SELECT DATE_FORMAT(d.dropout_date, '%Y-%m') as month, COUNT(*) as count FROM dropouts d
    JOIN students s ON d.student_id = s.student_id
    WHERE d.dropout_date BETWEEN p_start_date AND p_end_date AND (p_district_id IS NULL OR s.district_id = p_district_id)
    GROUP BY DATE_FORMAT(d.dropout_date, '%Y-%m') ORDER BY month;
END //

DELIMITER ;
