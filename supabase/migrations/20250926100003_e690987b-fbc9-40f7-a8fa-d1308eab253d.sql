-- Create enum types
CREATE TYPE app_role AS ENUM ('student', 'unit', 'admin');
CREATE TYPE internship_status AS ENUM ('active', 'closed', 'draft');
CREATE TYPE application_status AS ENUM ('applied', 'shortlisted', 'rejected', 'interviewed', 'hired');
CREATE TYPE course_status AS ENUM ('active', 'inactive', 'draft');
CREATE TYPE enrollment_status AS ENUM ('enrolled', 'completed', 'dropped');

-- Create internships table
CREATE TABLE public.internships (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    duration TEXT,
    payment TEXT,
    requirements JSONB DEFAULT '[]'::jsonb,
    responsibilities JSONB DEFAULT '[]'::jsonb,
    skills_required JSONB DEFAULT '[]'::jsonb,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status internship_status NOT NULL DEFAULT 'draft',
    posted_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    application_deadline DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    provider TEXT,
    duration TEXT,
    enrolled_count INTEGER DEFAULT 0,
    category TEXT,
    difficulty_level TEXT CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status course_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
    cover_letter TEXT,
    status application_status NOT NULL DEFAULT 'applied',
    applied_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(student_id, internship_id)
);

-- Create units table
CREATE TABLE public.units (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    unit_name TEXT NOT NULL,
    unit_type TEXT,
    focus_areas JSONB DEFAULT '[]'::jsonb,
    skills_offered JSONB DEFAULT '[]'::jsonb,
    opportunities_offered JSONB DEFAULT '[]'::jsonb,
    is_aurovillian BOOLEAN DEFAULT false,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_profiles table
CREATE TABLE public.student_profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    profile_type TEXT CHECK (profile_type IN ('Student', 'Fresher', 'Working')),
    interests JSONB DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    experience_level TEXT,
    preferred_language TEXT,
    looking_for JSONB DEFAULT '[]'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,
    languages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course_enrollments table
CREATE TABLE public.course_enrollments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completion_date TIMESTAMP WITH TIME ZONE,
    status enrollment_status NOT NULL DEFAULT 'enrolled',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(student_id, course_id)
);

-- Enable RLS on all tables
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for internships table
CREATE POLICY "Everyone can view active internships" ON public.internships
    FOR SELECT USING (status = 'active');

CREATE POLICY "Units can manage their own internships" ON public.internships
    FOR ALL USING (auth.uid() = created_by);

-- RLS Policies for courses table
CREATE POLICY "Everyone can view active courses" ON public.courses
    FOR SELECT USING (status = 'active');

CREATE POLICY "Units can manage their own courses" ON public.courses
    FOR ALL USING (auth.uid() = created_by);

-- RLS Policies for applications table
CREATE POLICY "Students can view their own applications" ON public.applications
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can create applications" ON public.applications
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own applications" ON public.applications
    FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Units can view applications to their internships" ON public.applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.internships 
            WHERE internships.id = applications.internship_id 
            AND internships.created_by = auth.uid()
        )
    );

CREATE POLICY "Units can update applications to their internships" ON public.applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.internships 
            WHERE internships.id = applications.internship_id 
            AND internships.created_by = auth.uid()
        )
    );

-- RLS Policies for units table
CREATE POLICY "Everyone can view unit information" ON public.units
    FOR SELECT USING (true);

CREATE POLICY "Units can create their own profile" ON public.units
    FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Units can update their own profile" ON public.units
    FOR UPDATE USING (auth.uid() = profile_id);

-- RLS Policies for student_profiles table
CREATE POLICY "Students can manage their own profile" ON public.student_profiles
    FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Units can view student profiles when processing applications" ON public.student_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.applications a
            JOIN public.internships i ON i.id = a.internship_id
            WHERE a.student_id = student_profiles.profile_id
            AND i.created_by = auth.uid()
        )
    );

-- RLS Policies for course_enrollments table
CREATE POLICY "Students can view their own enrollments" ON public.course_enrollments
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can enroll in courses" ON public.course_enrollments
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own enrollments" ON public.course_enrollments
    FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Course creators can view enrollments" ON public.course_enrollments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = course_enrollments.course_id 
            AND courses.created_by = auth.uid()
        )
    );

-- Create triggers for updated_at columns
CREATE TRIGGER update_internships_updated_at
    BEFORE UPDATE ON public.internships
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON public.applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_units_updated_at
    BEFORE UPDATE ON public.units
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at
    BEFORE UPDATE ON public.student_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_internships_status ON public.internships(status);
CREATE INDEX idx_internships_created_by ON public.internships(created_by);
CREATE INDEX idx_applications_student_id ON public.applications(student_id);
CREATE INDEX idx_applications_internship_id ON public.applications(internship_id);
CREATE INDEX idx_courses_status ON public.courses(status);
CREATE INDEX idx_courses_created_by ON public.courses(created_by);