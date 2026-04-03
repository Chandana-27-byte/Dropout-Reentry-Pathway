-- =====================================================
-- DROPOUT RE-ENTRY PATHWAY DATABASE SCHEMA
-- Complete DBMS Project
-- =====================================================

CREATE DATABASE IF NOT EXISTS dropout_reentry_db;
USE dropout_reentry_db;

-- Users Table (Authentication & Authorization)
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'counselor', 'institution', 'student') NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

CREATE TABLE states (
    state_id INT PRIMARY KEY AUTO_INCREMENT,
    state_name VARCHAR(50) NOT NULL,
    state_code VARCHAR(5) UNIQUE NOT NULL
);

CREATE TABLE districts (
    district_id INT PRIMARY KEY AUTO_INCREMENT,
    district_name VARCHAR(100) NOT NULL,
    state_id INT NOT NULL,
    FOREIGN KEY (state_id) REFERENCES states(state_id) ON DELETE CASCADE
);

CREATE TABLE institutions (
    institution_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    institution_name VARCHAR(200) NOT NULL,
    institution_type ENUM('school', 'college', 'university', 'vocational', 'online_platform') NOT NULL,
    accreditation_status VARCHAR(50),
    district_id INT,
    address TEXT,
    pincode VARCHAR(10),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    website VARCHAR(255),
    established_year INT,
    total_capacity INT,
    current_strength INT DEFAULT 0,
    facilities TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (district_id) REFERENCES districts(district_id),
    INDEX idx_type (institution_type),
    INDEX idx_district (district_id)
);

CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    enrollment_number VARCHAR(50) UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    district_id INT,
    pincode VARCHAR(10),
    aadhaar_number VARCHAR(12) UNIQUE,
    category ENUM('general', 'obc', 'sc', 'st', 'ews') DEFAULT 'general',
    is_differently_abled BOOLEAN DEFAULT FALSE,
    disability_type VARCHAR(100),
    father_name VARCHAR(100),
    mother_name VARCHAR(100),
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(20),
    guardian_occupation VARCHAR(100),
    family_income DECIMAL(12, 2),
    photo_url VARCHAR(255),
    documents JSON,
    status ENUM('active', 'dropout', 'reentry', 'completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (district_id) REFERENCES districts(district_id),
    INDEX idx_status (status),
    INDEX idx_enrollment (enrollment_number)
);

CREATE TABLE educational_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    institution_id INT,
    education_level ENUM('primary', 'middle', 'secondary', 'higher_secondary', 'graduation', 'post_graduation') NOT NULL,
    class_grade VARCHAR(20),
    board_university VARCHAR(100),
    start_date DATE,
    end_date DATE,
    percentage_cgpa DECIMAL(5, 2),
    status ENUM('completed', 'ongoing', 'dropped') DEFAULT 'ongoing',
    certificate_url VARCHAR(255),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (institution_id) REFERENCES institutions(institution_id) ON DELETE SET NULL
);

CREATE TABLE dropout_reasons_master (
    reason_id INT PRIMARY KEY AUTO_INCREMENT,
    reason_category ENUM('financial', 'academic', 'personal', 'health', 'social', 'institutional', 'other') NOT NULL,
    reason_name VARCHAR(100) NOT NULL,
    description TEXT,
    severity_level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE dropouts (
    dropout_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    institution_id INT,
    educational_history_id INT,
    dropout_date DATE NOT NULL,
    last_class_attended VARCHAR(20),
    last_education_level ENUM('primary', 'middle', 'secondary', 'higher_secondary', 'graduation', 'post_graduation'),
    primary_reason_id INT,
    secondary_reasons JSON,
    detailed_reason TEXT,
    family_situation TEXT,
    financial_status ENUM('below_poverty', 'low_income', 'middle_income', 'above_middle') DEFAULT 'middle_income',
    willing_to_return BOOLEAN DEFAULT TRUE,
    preferred_mode ENUM('full_time', 'part_time', 'distance', 'online', 'flexible') DEFAULT 'flexible',
    available_time_slots JSON,
    special_needs TEXT,
    intervention_attempts TEXT,
    verified_by INT,
    verification_date DATE,
    status ENUM('recorded', 'verified', 'counseling', 'pathway_assigned', 'enrolled', 'reentry_completed', 'closed') DEFAULT 'recorded',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (institution_id) REFERENCES institutions(institution_id) ON DELETE SET NULL,
    FOREIGN KEY (educational_history_id) REFERENCES educational_history(history_id) ON DELETE SET NULL,
    FOREIGN KEY (primary_reason_id) REFERENCES dropout_reasons_master(reason_id) ON DELETE SET NULL,
    FOREIGN KEY (verified_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_student (student_id),
    INDEX idx_status (status),
    INDEX idx_date (dropout_date)
);

CREATE TABLE counselors (
    counselor_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    employee_id VARCHAR(50) UNIQUE,
    specialization VARCHAR(100),
    qualification VARCHAR(200),
    experience_years INT DEFAULT 0,
    languages_known VARCHAR(200),
    district_id INT,
    institution_id INT,
    max_students INT DEFAULT 50,
    current_students INT DEFAULT 0,
    availability JSON,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    success_rate DECIMAL(5, 2) DEFAULT 0.00,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (district_id) REFERENCES districts(district_id),
    FOREIGN KEY (institution_id) REFERENCES institutions(institution_id) ON DELETE SET NULL,
    INDEX idx_district (district_id),
    INDEX idx_available (is_available)
);

CREATE TABLE counseling_sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    dropout_id INT NOT NULL,
    counselor_id INT NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    session_type ENUM('initial_assessment', 'career_guidance', 'academic_planning', 'emotional_support', 'follow_up', 'final_review') NOT NULL,
    session_mode ENUM('in_person', 'phone', 'video_call') DEFAULT 'in_person',
    meeting_link VARCHAR(255),
    agenda TEXT,
    notes TEXT,
    recommendations TEXT,
    next_steps TEXT,
    student_feedback TEXT,
    student_rating INT CHECK (student_rating >= 1 AND student_rating <= 5),
    status ENUM('scheduled', 'completed', 'cancelled', 'no_show', 'rescheduled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dropout_id) REFERENCES dropouts(dropout_id) ON DELETE CASCADE,
    FOREIGN KEY (counselor_id) REFERENCES counselors(counselor_id) ON DELETE CASCADE,
    INDEX idx_dropout (dropout_id),
    INDEX idx_counselor (counselor_id),
    INDEX idx_date (session_date)
);

CREATE TABLE pathways (
    pathway_id INT PRIMARY KEY AUTO_INCREMENT,
    pathway_name VARCHAR(200) NOT NULL,
    pathway_code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    pathway_type ENUM('academic', 'vocational', 'skill_based', 'bridge_course', 'certification', 'diploma') NOT NULL,
    target_education_level ENUM('primary', 'middle', 'secondary', 'higher_secondary', 'graduation', 'post_graduation'),
    prerequisite_level ENUM('none', 'primary', 'middle', 'secondary', 'higher_secondary'),
    duration_months INT NOT NULL,
    mode ENUM('full_time', 'part_time', 'distance', 'online', 'hybrid') NOT NULL,
    total_credits INT,
    total_modules INT,
    syllabus JSON,
    eligibility_criteria TEXT,
    fee_amount DECIMAL(10, 2),
    scholarship_available BOOLEAN DEFAULT FALSE,
    scholarship_details TEXT,
    institution_id INT,
    max_enrollment INT,
    current_enrollment INT DEFAULT 0,
    success_rate DECIMAL(5, 2) DEFAULT 0.00,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(institution_id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_type (pathway_type),
    INDEX idx_mode (mode),
    INDEX idx_active (is_active)
);

CREATE TABLE pathway_modules (
    module_id INT PRIMARY KEY AUTO_INCREMENT,
    pathway_id INT NOT NULL,
    module_name VARCHAR(200) NOT NULL,
    module_code VARCHAR(20) NOT NULL,
    description TEXT,
    sequence_order INT NOT NULL,
    duration_weeks INT,
    credits INT,
    learning_outcomes TEXT,
    assessment_type ENUM('exam', 'assignment', 'project', 'practical', 'combined') DEFAULT 'combined',
    passing_percentage DECIMAL(5, 2) DEFAULT 40.00,
    resources JSON,
    is_mandatory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pathway_id) REFERENCES pathways(pathway_id) ON DELETE CASCADE,
    INDEX idx_pathway (pathway_id),
    UNIQUE KEY unique_module_code (pathway_id, module_code)
);

CREATE TABLE enrollments (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    dropout_id INT NOT NULL,
    pathway_id INT NOT NULL,
    counselor_id INT,
    enrollment_date DATE NOT NULL,
    expected_completion_date DATE,
    actual_completion_date DATE,
    fee_paid DECIMAL(10, 2) DEFAULT 0.00,
    scholarship_received DECIMAL(10, 2) DEFAULT 0.00,
    payment_status ENUM('pending', 'partial', 'completed', 'waived') DEFAULT 'pending',
    current_module_id INT,
    modules_completed INT DEFAULT 0,
    overall_percentage DECIMAL(5, 2) DEFAULT 0.00,
    attendance_percentage DECIMAL(5, 2) DEFAULT 0.00,
    status ENUM('enrolled', 'in_progress', 'on_hold', 'dropped', 'completed', 'certified') DEFAULT 'enrolled',
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_url VARCHAR(255),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dropout_id) REFERENCES dropouts(dropout_id) ON DELETE CASCADE,
    FOREIGN KEY (pathway_id) REFERENCES pathways(pathway_id) ON DELETE CASCADE,
    FOREIGN KEY (counselor_id) REFERENCES counselors(counselor_id) ON DELETE SET NULL,
    FOREIGN KEY (current_module_id) REFERENCES pathway_modules(module_id) ON DELETE SET NULL,
    INDEX idx_dropout (dropout_id),
    INDEX idx_pathway (pathway_id),
    INDEX idx_status (status),
    UNIQUE KEY unique_enrollment (dropout_id, pathway_id)
);

CREATE TABLE progress_tracking (
    progress_id INT PRIMARY KEY AUTO_INCREMENT,
    enrollment_id INT NOT NULL,
    module_id INT NOT NULL,
    start_date DATE,
    completion_date DATE,
    status ENUM('not_started', 'in_progress', 'completed', 'failed', 'retaking') DEFAULT 'not_started',
    attendance_percentage DECIMAL(5, 2) DEFAULT 0.00,
    assignment_score DECIMAL(5, 2),
    exam_score DECIMAL(5, 2),
    practical_score DECIMAL(5, 2),
    overall_score DECIMAL(5, 2),
    grade VARCHAR(5),
    attempts INT DEFAULT 1,
    instructor_remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(enrollment_id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES pathway_modules(module_id) ON DELETE CASCADE,
    INDEX idx_enrollment (enrollment_id),
    UNIQUE KEY unique_progress (enrollment_id, module_id)
);

CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'warning', 'success', 'error', 'reminder') DEFAULT 'info',
    category ENUM('enrollment', 'session', 'progress', 'payment', 'system', 'other') DEFAULT 'other',
    reference_type VARCHAR(50),
    reference_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read)
);

CREATE TABLE audit_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_table (table_name),
    INDEX idx_date (created_at)
);
