-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    department TEXT,
    manager_id UUID REFERENCES profiles(id),
    company TEXT DEFAULT 'Dayflow',
    location TEXT,
    about TEXT,
    job_love TEXT,
    interests TEXT,
    resume_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
    ON profiles FOR SELECT
    USING ( true );

CREATE POLICY "Users can insert their own profile."
    ON profiles FOR INSERT
    WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
    ON profiles FOR UPDATE
    USING ( auth.uid() = id );

-- Create personal_info table (Private)
CREATE TABLE personal_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    date_of_birth DATE,
    nationality TEXT,
    gender TEXT,
    marital_status TEXT,
    personal_email TEXT,
    residing_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS for personal_info
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own personal info."
    ON personal_info FOR SELECT
    USING ( auth.uid() = user_id );

CREATE POLICY "Users can update own personal info."
    ON personal_info FOR UPDATE
    USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert own personal info."
    ON personal_info FOR INSERT
    WITH CHECK ( auth.uid() = user_id );

-- Create banking_info table (Private)
CREATE TABLE banking_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    bank_name TEXT,
    account_number TEXT, -- In a real app, this should be encrypted
    ifsc_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS for banking_info
ALTER TABLE banking_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own banking info."
    ON banking_info FOR SELECT
    USING ( auth.uid() = user_id );

CREATE POLICY "Users can update own banking info."
    ON banking_info FOR UPDATE
    USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert own banking info."
    ON banking_info FOR INSERT
    WITH CHECK ( auth.uid() = user_id );


-- Create skills table
CREATE TABLE skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    skill_name TEXT NOT NULL,
    proficiency_level TEXT,
    years_of_experience NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS for skills
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skills are viewable by everyone."
    ON skills FOR SELECT
    USING ( true );

CREATE POLICY "Users can manage own skills."
    ON skills FOR ALL
    USING ( auth.uid() = user_id );

-- Create certifications table
CREATE TABLE certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    certification_name TEXT NOT NULL,
    issuing_organization TEXT,
    issue_date DATE,
    expiration_date DATE,
    credential_id TEXT,
    verification_url TEXT,
    certificate_doc_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS for certifications
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Certifications are viewable by everyone."
    ON certifications FOR SELECT
    USING ( true );

CREATE POLICY "Users can manage own certifications."
    ON certifications FOR ALL
    USING ( auth.uid() = user_id );

-- Create salary_info table (Restricted access - typically view only for employee)
CREATE TABLE salary_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    basic_salary NUMERIC,
    hra NUMERIC,
    standard_allowance NUMERIC,
    performance_bonus NUMERIC,
    lta NUMERIC,
    fixed_allowance NUMERIC,
    employee_pf NUMERIC,
    employer_pf NUMERIC,
    professional_tax NUMERIC,
    gross_salary NUMERIC,
    net_salary NUMERIC,
    ctc NUMERIC,
    effective_from DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS for salary_info
ALTER TABLE salary_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own salary info."
    ON salary_info FOR SELECT
);

-- Create attendance table
CREATE TABLE attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    check_in_time TIME,
    check_out_time TIME,
    status TEXT, -- Present, Absent, Late
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS for attendance
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own attendance."
    ON attendance FOR SELECT
    USING ( auth.uid() = user_id );

CREATE POLICY "Users can mark own attendance."
    ON attendance FOR INSERT
    WITH CHECK ( auth.uid() = user_id );

-- Create leave_requests table
CREATE TABLE leave_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    leave_type TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days NUMERIC NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'Pending', -- Pending, Approved, Rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS for leave_requests
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own leave requests."
    ON leave_requests FOR SELECT
    USING ( auth.uid() = user_id );

CREATE POLICY "Users can create leave requests."
    ON leave_requests FOR INSERT
    WITH CHECK ( auth.uid() = user_id );
