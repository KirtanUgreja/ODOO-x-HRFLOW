
import { pgTable, text, timestamp, boolean, uuid, date, numeric, time } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Users table (Replacing Supabase Auth)
export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull().unique(),
    password_hash: text('password_hash').notNull(),
    full_name: text('full_name'),
    phone: text('phone'),
    role: text('role').default('employee').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});

// Profiles
export const profiles = pgTable('profiles', {
    id: uuid('id').references(() => users.id).primaryKey(), // One-to-one with users
    email: text('email').notNull().unique(),
    full_name: text('full_name'),
    avatar_url: text('avatar_url'),
    department: text('department'),
    manager_id: uuid('manager_id'), // Self-reference usually handled in app logic or separate relation
    company: text('company').default('Dayflow'),
    location: text('location'),
    about: text('about'),
    job_love: text('job_love'),
    interests: text('interests'),
    resume_url: text('resume_url'),
    updated_at: timestamp('updated_at').defaultNow(),
});

// Personal Info
export const personalInfo = pgTable('personal_info', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').references(() => users.id).notNull().unique(),
    date_of_birth: date('date_of_birth'), // standard YYYY-MM-DD
    nationality: text('nationality'),
    gender: text('gender'),
    marital_status: text('marital_status'),
    personal_email: text('personal_email'),
    residing_address: text('residing_address'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});

// Banking Info
export const bankingInfo = pgTable('banking_info', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').references(() => users.id).notNull().unique(),
    bank_name: text('bank_name'),
    account_number: text('account_number'),
    ifsc_code: text('ifsc_code'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});

// Skills
export const skills = pgTable('skills', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').references(() => users.id).notNull(),
    skill_name: text('skill_name').notNull(),
    proficiency_level: text('proficiency_level'),
    years_of_experience: numeric('years_of_experience'),
    created_at: timestamp('created_at').defaultNow(),
});

// Certifications
export const certifications = pgTable('certifications', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').references(() => users.id).notNull(),
    certification_name: text('certification_name').notNull(),
    issuing_organization: text('issuing_organization'),
    issue_date: date('issue_date'),
    expiration_date: date('expiration_date'),
    credential_id: text('credential_id'),
    verification_url: text('verification_url'),
    certificate_doc_url: text('certificate_doc_url'),
    created_at: timestamp('created_at').defaultNow(),
});

// Attendance
export const attendance = pgTable('attendance', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').references(() => users.id).notNull(),
    date: date('date').defaultNow(),
    check_in_time: time('check_in_time'),
    check_out_time: time('check_out_time'),
    status: text('status'), // Present, Absent, Late
    created_at: timestamp('created_at').defaultNow(),
});

// Leave Requests
export const leaveRequests = pgTable('leave_requests', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').references(() => users.id).notNull(),
    leave_type: text('leave_type').notNull(),
    start_date: date('start_date').notNull(),
    end_date: date('end_date').notNull(),
    days: numeric('days').notNull(),
    reason: text('reason'),
    status: text('status').default('Pending'),
    created_at: timestamp('created_at').defaultNow(),
});

// Salary Info
export const salaryInfo = pgTable('salary_info', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').references(() => users.id).notNull().unique(),
    basic_salary: numeric('basic_salary'),
    hra: numeric('hra'),
    standard_allowance: numeric('standard_allowance'),
    performance_bonus: numeric('performance_bonus'),
    lta: numeric('lta'),
    fixed_allowance: numeric('fixed_allowance'),
    employee_pf: numeric('employee_pf'),
    employer_pf: numeric('employer_pf'),
    professional_tax: numeric('professional_tax'),
    gross_salary: numeric('gross_salary'),
    net_salary: numeric('net_salary'),
    ctc: numeric('ctc'),
    effective_from: date('effective_from'),
    updated_at: timestamp('updated_at').defaultNow(),
});
