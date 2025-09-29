import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DatabaseProfile, StudentProfile } from '@/types/profile';
import { useToast } from '@/hooks/use-toast';

export const useProfileData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<DatabaseProfile | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch basic profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profileData) {
        setProfile(profileData);

        // Fetch student profile if user is a student
        if (profileData.role === 'student') {
          const { data: studentData, error: studentError } = await supabase
            .from('student_profiles')
            .select('*')
            .eq('profile_id', user.id)
            .maybeSingle();

          if (studentError && studentError.code !== 'PGRST116') {
            throw studentError;
          }

          setStudentProfile(studentData as StudentProfile || null);
        }
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<DatabaseProfile>) => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const updateStudentProfile = async (updates: Partial<StudentProfile>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .upsert({
          profile_id: user.id,
          ...updates
        }, {
          onConflict: 'profile_id'
        })
        .select()
        .single();

      if (error) throw error;

      setStudentProfile(data as StudentProfile || null);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to update student profile",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  return {
    profile,
    studentProfile,
    loading,
    error,
    updateProfile,
    updateStudentProfile,
    refetch: fetchProfileData
  };
};