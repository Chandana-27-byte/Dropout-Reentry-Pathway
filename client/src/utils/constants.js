// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  STUDENTS: '/students',
  DROPOUTS: '/dropouts',
  PATHWAYS: '/pathways',
  ENROLLMENTS: '/enrollments',
  COUNSELORS: '/counselors',
  INSTITUTIONS: '/institutions',
  REPORTS: '/reports',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  COUNSELOR: 'counselor',
  INSTITUTION: 'institution',
  STUDENT: 'student',
};

// Student Status
export const STUDENT_STATUS = {
  ACTIVE: 'active',
  DROPOUT: 'dropout',
  REENTRY: 'reentry',
  COMPLETED: 'completed',
};

// Dropout Status
export const DROPOUT_STATUS = {
  RECORDED: 'recorded',
  VERIFIED: 'verified',
  COUNSELING: 'counseling',
  PATHWAY_ASSIGNED: 'pathway_assigned',
  ENROLLED: 'enrolled',
  REENTRY_COMPLETED: 'reentry_completed',
  CLOSED: 'closed',
};

// Education Levels
export const EDUCATION_LEVELS = [
  { value: 'primary', label: 'Primary (1-5)' },
  { value: 'middle', label: 'Middle (6-8)' },
  { value: 'secondary', label: 'Secondary (9-10)' },
  { value: 'higher_secondary', label: 'Higher Secondary (11-12)' },
  { value: 'graduation', label: 'Graduation' },
  { value: 'post_graduation', label: 'Post Graduation' },
];

// Pathway Types
export const PATHWAY_TYPES = [
  { value: 'academic', label: 'Academic' },
  { value: 'vocational', label: 'Vocational' },
  { value: 'skill_based', label: 'Skill Based' },
  { value: 'bridge_course', label: 'Bridge Course' },
  { value: 'certification', label: 'Certification' },
  { value: 'diploma', label: 'Diploma' },
];

// Study Modes
export const STUDY_MODES = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'distance', label: 'Distance Learning' },
  { value: 'online', label: 'Online' },
  { value: 'hybrid', label: 'Hybrid' },
];

// Categories
export const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'obc', label: 'OBC' },
  { value: 'sc', label: 'SC' },
  { value: 'st', label: 'ST' },
  { value: 'ews', label: 'EWS' },
];

// Gender Options
export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

// Financial Status
export const FINANCIAL_STATUS = [
  { value: 'below_poverty', label: 'Below Poverty Line' },
  { value: 'low_income', label: 'Low Income' },
  { value: 'middle_income', label: 'Middle Income' },
  { value: 'above_middle', label: 'Above Middle Income' },
];

// Chart Colors
export const CHART_COLORS = [
  '#3b82f6',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#84cc16',
  '#f97316',
  '#6366f1',
];

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
