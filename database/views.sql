-- =====================================================
-- VIEWS
-- =====================================================

USE dropout_reentry_db;

-- View: Dropout Details with All Information
CREATE OR REPLACE VIEW vw_dropout_details AS
SELECT 
    d.dropout_id, d.dropout_date, d.last_class_attended, d.last_education_level,
    d.status as dropout_status, d.willing_to_return, d.preferred_mode,
    s.student_id, s.enrollment_number,
    CONCAT(s.first_name, ' ', s.last_name) as student_name,
    s.gender, s.date_of_birth,
    TIMESTAMPDIFF(YEAR, s.date_of_birth, CURDATE()) as age,
    s.phone as student_phone, s.email as student_email, s.category, s.family_income,
    i.institution_name, i.institution_type,
    dist.district_name, st.state_name,
    drm.reason_category, drm.reason_name as primary_reason,
    d.detailed_reason, d.created_at as recorded_date
FROM dropouts d
JOIN students s ON d.student_id = s.student_id
LEFT JOIN institutions i ON d.institution_id = i.institution_id
LEFT JOIN districts dist ON s.district_id = dist.district_id
LEFT JOIN states st ON dist.state_id = st.state_id
LEFT JOIN dropout_reasons_master drm ON d.primary_reason_id = drm.reason_id;

-- View: Enrollment Progress Overview
CREATE OR REPLACE VIEW vw_enrollment_progress AS
SELECT 
    e.enrollment_id, e.enrollment_date, e.expected_completion_date,
    e.status as enrollment_status, e.modules_completed, e.overall_percentage, e.attendance_percentage,
    d.dropout_id, s.student_id,
    CONCAT(s.first_name, ' ', s.last_name) as student_name, s.enrollment_number,
    p.pathway_id, p.pathway_name, p.pathway_type, p.duration_months, p.total_modules,
    CONCAT(u.first_name, ' ', u.last_name) as counselor_name, c.counselor_id,
    pm.module_name as current_module,
    ROUND((e.modules_completed * 100.0 / p.total_modules), 2) as completion_percentage
FROM enrollments e
JOIN dropouts d ON e.dropout_id = d.dropout_id
JOIN students s ON d.student_id = s.student_id
JOIN pathways p ON e.pathway_id = p.pathway_id
LEFT JOIN counselors c ON e.counselor_id = c.counselor_id
LEFT JOIN users u ON c.user_id = u.user_id
LEFT JOIN pathway_modules pm ON e.current_module_id = pm.module_id;

-- View: Pathway Statistics
CREATE OR REPLACE VIEW vw_pathway_stats AS
SELECT 
    p.pathway_id, p.pathway_code, p.pathway_name, p.pathway_type, p.mode,
    p.duration_months, p.fee_amount, p.scholarship_available,
    p.max_enrollment, p.current_enrollment, p.success_rate, p.rating,
    i.institution_name, p.total_modules,
    (SELECT COUNT(*) FROM enrollments WHERE pathway_id = p.pathway_id AND status = 'completed') as completed_count,
    (SELECT COUNT(*) FROM enrollments WHERE pathway_id = p.pathway_id AND status = 'in_progress') as active_count,
    (SELECT COUNT(*) FROM enrollments WHERE pathway_id = p.pathway_id AND status = 'dropped') as dropped_count
FROM pathways p
LEFT JOIN institutions i ON p.institution_id = i.institution_id
WHERE p.is_active = TRUE;

-- View: District-wise Dropout Summary
CREATE OR REPLACE VIEW vw_district_dropout_summary AS
SELECT 
    dist.district_id, dist.district_name, st.state_name,
    COUNT(DISTINCT d.dropout_id) as total_dropouts,
    COUNT(DISTINCT CASE WHEN d.status = 'enrolled' THEN d.dropout_id END) as enrolled_count,
    COUNT(DISTINCT CASE WHEN d.status = 'reentry_completed' THEN d.dropout_id END) as completed_count,
    COUNT(DISTINCT CASE WHEN s.gender = 'male' THEN d.dropout_id END) as male_dropouts,
    COUNT(DISTINCT CASE WHEN s.gender = 'female' THEN d.dropout_id END) as female_dropouts,
    ROUND(COUNT(DISTINCT CASE WHEN d.status = 'reentry_completed' THEN d.dropout_id END) * 100.0 / NULLIF(COUNT(DISTINCT d.dropout_id), 0), 2) as reentry_rate
FROM districts dist
JOIN states st ON dist.state_id = st.state_id
LEFT JOIN students s ON s.district_id = dist.district_id
LEFT JOIN dropouts d ON d.student_id = s.student_id
GROUP BY dist.district_id;

-- View: Counselor Performance
CREATE OR REPLACE VIEW vw_counselor_performance AS
SELECT 
    c.counselor_id, CONCAT(u.first_name, ' ', u.last_name) as counselor_name,
    u.email, c.specialization, c.experience_years, c.current_students, c.max_students,
    c.rating, c.total_reviews, c.success_rate, dist.district_name,
    (SELECT COUNT(*) FROM counseling_sessions WHERE counselor_id = c.counselor_id) as total_sessions,
    (SELECT COUNT(*) FROM counseling_sessions WHERE counselor_id = c.counselor_id AND status = 'completed') as completed_sessions,
    (SELECT COUNT(*) FROM enrollments WHERE counselor_id = c.counselor_id AND status = 'completed') as successful_reentries
FROM counselors c
JOIN users u ON c.user_id = u.user_id
LEFT JOIN districts dist ON c.district_id = dist.district_id
WHERE c.is_available = TRUE;
