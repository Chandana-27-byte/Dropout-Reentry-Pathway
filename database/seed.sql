-- =====================================================
-- SEED DATA FOR DROPOUT RE-ENTRY PATHWAY
-- =====================================================

USE dropout_reentry_db;

-- Insert States
INSERT INTO states (state_name, state_code) VALUES
('Andhra Pradesh', 'AP'), ('Karnataka', 'KA'), ('Tamil Nadu', 'TN'),
('Maharashtra', 'MH'), ('Kerala', 'KL'), ('Telangana', 'TS'),
('Delhi', 'DL'), ('Gujarat', 'GJ'), ('Rajasthan', 'RJ'), ('Uttar Pradesh', 'UP');

-- Insert Districts
INSERT INTO districts (district_name, state_id) VALUES
('Visakhapatnam', 1), ('Vijayawada', 1), ('Guntur', 1),
('Bangalore Urban', 2), ('Mysore', 2), ('Hubli', 2),
('Chennai', 3), ('Coimbatore', 3), ('Madurai', 3),
('Mumbai', 4), ('Pune', 4), ('Nagpur', 4),
('Thiruvananthapuram', 5), ('Kochi', 5), ('Kozhikode', 5),
('Hyderabad', 6), ('Warangal', 6), ('Karimnagar', 6);

-- Insert Admin User (password: Admin@123)
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active, email_verified) VALUES
('admin@dropout-reentry.com', '$2a$10$Mz2C6QpGQFn/09JWJPQPyuX9QgqTI.4rubv/NADv1Sk2RqRGsKZye', 'admin', 'System', 'Administrator', '9999999999', TRUE, TRUE);

-- Insert Dropout Reasons
INSERT INTO dropout_reasons_master (reason_id, reason_category, reason_name, description, severity_level) VALUES
(1, 'financial', 'Unable to afford fees', 'Family cannot afford tuition fees', 'high'),
(2, 'financial', 'Need to support family', 'Student needs to work to support family income', 'high'),
(3, 'financial', 'No funds for materials', 'Cannot afford books, uniforms, etc.', 'medium'),
(4, 'academic', 'Poor academic performance', 'Struggling with academics and failing grades', 'medium'),
(5, 'academic', 'Learning difficulties', 'Has learning disabilities', 'high'),
(6, 'academic', 'Lack of interest', 'Not interested in current curriculum', 'low'),
(7, 'academic', 'Language barrier', 'Difficulty understanding medium of instruction', 'medium'),
(8, 'personal', 'Early marriage', 'Forced into early marriage', 'critical'),
(9, 'personal', 'Family responsibilities', 'Has to take care of family members', 'high'),
(10, 'personal', 'Migration', 'Family migrated to different location', 'medium'),
(11, 'personal', 'Pregnancy', 'Student or partner pregnancy', 'high'),
(12, 'health', 'Chronic illness', 'Suffering from chronic health condition', 'high'),
(13, 'health', 'Mental health issues', 'Anxiety, depression, or other mental health challenges', 'high'),
(14, 'health', 'Physical disability', 'Physical disability affecting attendance', 'high'),
(15, 'social', 'Bullying', 'Victim of bullying or harassment', 'high'),
(16, 'social', 'Discrimination', 'Facing discrimination based on caste/gender/religion', 'critical'),
(17, 'social', 'Peer pressure', 'Negative peer influence', 'medium'),
(18, 'institutional', 'School too far', 'School/college is too far from home', 'medium'),
(19, 'institutional', 'Poor infrastructure', 'Lack of basic facilities in institution', 'medium'),
(20, 'institutional', 'Teacher absenteeism', 'Frequent absence of teachers', 'low'),
(21, 'institutional', 'Safety concerns', 'Unsafe environment', 'high'),
(22, 'other', 'Natural disaster', 'Affected by natural calamity', 'critical'),
(23, 'other', 'COVID-19 impact', 'Pandemic related disruption', 'high'),
(24, 'other', 'Unknown', 'Reason not disclosed or unknown', 'low');

-- Insert Sample Students
INSERT INTO students (student_id, first_name, last_name, date_of_birth, gender, email, phone, enrollment_number, district_id, status) VALUES
(1, 'Rahul', 'Sharma', '2008-05-15', 'male', 'rahul@example.com', '9876543210', 'STU001', 4, 'dropout'),
(2, 'Priya', 'Patel', '2009-08-22', 'female', 'priya@example.com', '9876543211', 'STU002', 11, 'dropout'),
(3, 'Amit', 'Kumar', '2007-03-10', 'male', 'amit@example.com', '9876543212', 'STU003', 13, 'dropout'),
(4, 'Sneha', 'Reddy', '2010-11-05', 'female', 'sneha@example.com', '9876543213', 'STU004', 16, 'active'),
(5, 'Vikram', 'Singh', '2008-01-30', 'male', 'vikram@example.com', '9876543214', 'STU005', 14, 'dropout');

-- Insert Dropout Records
INSERT INTO dropouts (student_id, dropout_date, primary_reason_id, detailed_reason, status, willing_to_return) VALUES
(1, '2023-06-15', 1, 'Family facing severe financial crisis', 'verified', TRUE),
(2, '2023-09-10', 8, 'Parental pressure for early marriage', 'recorded', TRUE),
(3, '2023-12-05', 4, 'Struggling with advanced mathematics', 'pathway_assigned', TRUE),
(5, '2024-02-20', 18, 'School is 15km away with no transport', 'verified', TRUE);

-- Insert Pathways
INSERT INTO pathways (pathway_id, pathway_name, pathway_code, pathway_type, description, duration_months, mode, total_modules, max_enrollment, current_enrollment, success_rate, rating) VALUES
(1, 'Bridge Course (Secondary)', 'BR-SEC-01', 'bridge_course', 'Fast-track course to re-enter school', 6, 'full_time', 4, 50, 0, 85.0, 4.5),
(2, 'Computer Basics & IT', 'VOC-IT-02', 'vocational', 'Practical IT skills for employment', 4, 'part_time', 6, 30, 0, 92.0, 4.8),
(3, 'Vocational Tailoring', 'VOC-TL-03', 'vocational', 'Skill development in garment making', 3, 'part_time', 3, 20, 0, 88.0, 4.2);

-- Insert Pathway Modules
INSERT INTO pathway_modules (pathway_id, module_name, module_code, description, sequence_order, duration_weeks, credits, is_mandatory, assessment_type, passing_percentage) VALUES
(1, 'Basics of Literacy', 'LIT01', 'Reading and writing skills', 1, 4, 10, 1, 'exam', 40),
(1, 'General Science', 'SCI01', 'Fundamental science concepts', 2, 8, 15, 1, 'exam', 40),
(1, 'Mathematics', 'MAT01', 'Basic arithmetic and logic', 3, 8, 15, 1, 'exam', 40),
(1, 'Social Studies', 'SOC01', 'History and geography basics', 4, 4, 10, 0, 'combined', 40),
(2, 'Intro to Computers', 'IT01', 'Hardware and OS basics', 1, 2, 5, 1, 'practical', 50),
(2, 'MS Office Suite', 'IT02', 'Word, Excel, PowerPoint', 2, 6, 10, 1, 'practical', 50),
(2, 'Internet & Email', 'IT03', 'Online communication and search', 3, 2, 5, 1, 'combined', 50),
(2, 'Digital Tools', 'IT04', 'Cloud storage and collab tools', 4, 2, 5, 0, 'practical', 50),
(2, 'Basic Hardware Repair', 'IT05', 'Troubleshooting and maintenance', 5, 4, 10, 0, 'practical', 50),
(2, 'Career Guidance', 'IT06', 'Soft skills and job search', 6, 2, 5, 1, 'combined', 50),
(3, 'Pattern Making', 'TL01', 'Measuring and cutting patterns', 1, 4, 10, 1, 'practical', 60),
(3, 'Machine Operations', 'TL02', 'Using various sewing machines', 2, 4, 10, 1, 'practical', 60),
(3, 'Garment Assembly', 'TL03', 'Assembling different clothing items', 3, 4, 10, 1, 'practical', 60);

-- Insert Enrollments
INSERT INTO enrollments (dropout_id, pathway_id, enrollment_date, status, modules_completed) VALUES
(3, 1, '2024-01-10', 'enrolled', 0);
