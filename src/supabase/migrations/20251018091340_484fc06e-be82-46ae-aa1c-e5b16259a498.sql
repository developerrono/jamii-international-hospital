-- Create enum for user roles
-- NOTE: The 'pending' role is handled by the app logic check, but 'patient' is the default role here.
CREATE TYPE public.app_role AS ENUM ('admin', 'doctor', 'nurse', 'patient');

-- Create enum for appointment status
CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create enum for billing status
CREATE TYPE public.billing_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Create enum for payment method
CREATE TYPE public.payment_method AS ENUM ('mpesa', 'cash', 'card');

-- 🛑 Modification: Remove the user_roles table
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- 🛑 Modification: Remove the redundant has_role function
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);

-- Create profiles table (with role column added and defaulted to 'patient')
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  -- 🛑 MODIFICATION: ADDED THE ROLE COLUMN
  role app_role NOT NULL DEFAULT 'patient',
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create doctors table (no change)
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  specialization TEXT NOT NULL,
  license_number TEXT NOT NULL UNIQUE,
  department TEXT,
  consultation_fee DECIMAL(10,2),
  available_days TEXT[],
  available_hours TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on doctors
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Create appointments table (no change)
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status appointment_status NOT NULL DEFAULT 'pending',
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create invoices table (no change)
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status billing_status NOT NULL DEFAULT 'pending',
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create mpesa_transactions table (no change)
CREATE TABLE public.mpesa_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  merchant_request_id TEXT,
  checkout_request_id TEXT,
  phone_number TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  mpesa_receipt_number TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE,
  status billing_status NOT NULL DEFAULT 'pending',
  response_code TEXT,
  response_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on mpesa_transactions
ALTER TABLE public.mpesa_transactions ENABLE ROW LEVEL SECURITY;

-- Create medical_records table (EHR) (no change)
CREATE TABLE public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  visit_date DATE NOT NULL,
  chief_complaint TEXT,
  vitals JSONB,
  diagnosis TEXT,
  prescription TEXT,
  lab_tests TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on medical_records
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

-- Create trigger function for updated_at (no change)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at on all tables (no change)
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
BEFORE UPDATE ON public.doctors
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mpesa_transactions_updated_at
BEFORE UPDATE ON public.mpesa_transactions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at
BEFORE UPDATE ON public.medical_records
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- 🛑 MODIFICATION: Trigger function now inserts the role directly into the profiles table.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Patient'),
    new.email,
    'patient' -- Assigned default 'patient' role
  );
  
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup (no change)
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- 🛑 MODIFICATION: RLS Policies for profiles (Updated to check role directly)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- 🛑 MODIFICATION: Now checks the user's role directly from the profiles table
DROP POLICY IF EXISTS "Admins and staff can view all profiles" ON public.profiles;
CREATE POLICY "Admins and staff can view all profiles"
ON public.profiles FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'doctor', 'nurse')
);


-- RLS Policies for doctors (no change needed in logic, but re-run for consistency)
DROP POLICY IF EXISTS "Everyone can view doctors" ON public.doctors;
CREATE POLICY "Everyone can view doctors"
ON public.doctors FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage doctors" ON public.doctors;
CREATE POLICY "Admins can manage doctors"
ON public.doctors FOR ALL
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'); -- 🛑 MODIFIED to check profile.role

DROP POLICY IF EXISTS "Doctors can update their own profile" ON public.doctors;
CREATE POLICY "Doctors can update their own profile"
ON public.doctors FOR UPDATE
USING (auth.uid() = user_id);

-- 🛑 MODIFICATION: RLS Policies for appointments (Updated to check role directly)
-- Patient policies remain the same
DROP POLICY IF EXISTS "Patients can view their own appointments" ON public.appointments;
CREATE POLICY "Patients can view their own appointments"
ON public.appointments FOR SELECT
USING (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Patients can create their own appointments" ON public.appointments;
CREATE POLICY "Patients can create their own appointments"
ON public.appointments FOR INSERT
WITH CHECK (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Patients can update their own appointments" ON public.appointments;
CREATE POLICY "Patients can update their own appointments"
ON public.appointments FOR UPDATE
USING (auth.uid() = patient_id);

-- Doctor policies remain the same
DROP POLICY IF EXISTS "Doctors can view their appointments" ON public.appointments;
CREATE POLICY "Doctors can view their appointments"
ON public.appointments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.doctors
    WHERE doctors.user_id = auth.uid()
    AND doctors.id = appointments.doctor_id
  )
);

-- 🛑 MODIFICATION: Staff policies updated to check profile.role
DROP POLICY IF EXISTS "Staff can view all appointments" ON public.appointments;
CREATE POLICY "Staff can view all appointments"
ON public.appointments FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'nurse')
);

DROP POLICY IF EXISTS "Staff can manage all appointments" ON public.appointments;
CREATE POLICY "Staff can manage all appointments"
ON public.appointments FOR ALL
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'nurse')
);


-- 🛑 MODIFICATION: RLS Policies for invoices (Updated to check role directly)
DROP POLICY IF EXISTS "Patients can view their own invoices" ON public.invoices;
CREATE POLICY "Patients can view their own invoices"
ON public.invoices FOR SELECT
USING (auth.uid() = patient_id);

-- 🛑 MODIFICATION: Staff policies updated to check profile.role
DROP POLICY IF EXISTS "Staff can view all invoices" ON public.invoices;
CREATE POLICY "Staff can view all invoices"
ON public.invoices FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'nurse')
);

DROP POLICY IF EXISTS "Staff can manage invoices" ON public.invoices;
CREATE POLICY "Staff can manage invoices"
ON public.invoices FOR ALL
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'nurse')
);


-- RLS Policies for mpesa_transactions (no change needed in logic)
DROP POLICY IF EXISTS "Patients can view their own transactions" ON public.mpesa_transactions;
CREATE POLICY "Patients can view their own transactions"
ON public.mpesa_transactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.invoices
    WHERE invoices.id = mpesa_transactions.invoice_id
    AND invoices.patient_id = auth.uid()
  )
);

-- 🛑 MODIFICATION: Staff policies updated to check profile.role
DROP POLICY IF EXISTS "Staff can view all transactions" ON public.mpesa_transactions;
CREATE POLICY "Staff can view all transactions"
ON public.mpesa_transactions FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'nurse')
);

-- System policies remain the same
DROP POLICY IF EXISTS "System can create transactions" ON public.mpesa_transactions;
CREATE POLICY "System can create transactions"
ON public.mpesa_transactions FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "System can update transactions" ON public.mpesa_transactions;
CREATE POLICY "System can update transactions"
ON public.mpesa_transactions FOR UPDATE
USING (true);


-- 🛑 MODIFICATION: RLS Policies for medical_records (Updated to check role directly)
DROP POLICY IF EXISTS "Patients can view their own medical records" ON public.medical_records;
CREATE POLICY "Patients can view their own medical records"
ON public.medical_records FOR SELECT
USING (auth.uid() = patient_id);

-- Doctor policies remain the same
DROP POLICY IF EXISTS "Doctors can view their patient records" ON public.medical_records;
CREATE POLICY "Doctors can view their patient records"
ON public.medical_records FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.doctors
    WHERE doctors.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Doctors can create medical records" ON public.medical_records;
CREATE POLICY "Doctors can create medical records"
ON public.medical_records FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.doctors
    WHERE doctors.user_id = auth.uid()
    AND doctors.id = medical_records.doctor_id
  )
);

DROP POLICY IF EXISTS "Doctors can update their own records" ON public.medical_records;
CREATE POLICY "Doctors can update their own records"
ON public.medical_records FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.doctors
    WHERE doctors.user_id = auth.uid()
    AND doctors.id = medical_records.doctor_id
  )
);

-- 🛑 MODIFICATION: Admins policy updated to check profile.role
DROP POLICY IF EXISTS "Admins can view all medical records" ON public.medical_records;
CREATE POLICY "Admins can view all medical records"
ON public.medical_records FOR SELECT
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');