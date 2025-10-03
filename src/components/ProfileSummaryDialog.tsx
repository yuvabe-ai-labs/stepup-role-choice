import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

interface ProfileSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  internship: Tables<'internships'>;
  onSuccess: () => void;
}

interface CompleteProfileData {
  profile: any;
  studentProfile: any;
  education: any[];
  internships: any[];
}

const ProfileSummaryDialog: React.FC<ProfileSummaryDialogProps> = ({
  isOpen,
  onClose,
  internship,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState<CompleteProfileData | null>(null);
  
  // Checkbox states - first 6 are disabled and checked, last 2 are optional
  const [sections, setSections] = useState({
    personal_details: true,
    profile_summary: true,
    courses: true,
    key_skills: true,
    education: true,
    interests: true,
    projects: false,
    internship: false,
  });

  // Fetch complete profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user || !isOpen) return;

      setIsLoading(true);
      try {
        // Fetch basic profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch student profile data
        const { data: studentProfile, error: studentError } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('profile_id', profile.id)
          .maybeSingle();

        if (studentError && studentError.code !== 'PGRST116') throw studentError;

        // Fetch education records
        const { data: education, error: educationError } = await supabase
          .from('student_education')
          .select('*')
          .eq('profile_id', profile.id)
          .order('end_year', { ascending: false });

        if (educationError) throw educationError;

        // Fetch internship history
        const { data: internships, error: internshipsError } = await supabase
          .from('student_internships')
          .select('*')
          .eq('profile_id', profile.id)
          .order('end_date', { ascending: false });

        if (internshipsError) throw internshipsError;

        setProfileData({
          profile,
          studentProfile: studentProfile || {},
          education: education || [],
          internships: internships || [],
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast({
          title: "Error",
          description: "Failed to load your profile data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user, isOpen, toast]);

  const handleSubmit = async () => {
    if (!user || !profileData) return;

    setIsSubmitting(true);
    try {
      // Get included sections
      const includedSections = Object.entries(sections)
        .filter(([_, checked]) => checked)
        .map(([section]) => section);

      // Create application record
      const applicationData = {
        student_id: profileData.profile.id, // Use profile.id, not auth user.id
        internship_id: internship.id,
        status: 'applied' as const,
        cover_letter: profileData.studentProfile?.cover_letter || '',
        included_sections: includedSections,
      };

      const { error } = await supabase
        .from('applications')
        .insert(applicationData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your application has been submitted successfully!",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const parseJsonField = (field: any, defaultValue: any = []) => {
    if (!field) return defaultValue;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return defaultValue;
      }
    }
    return Array.isArray(field) ? field : defaultValue;
  };

  const skills = parseJsonField(profileData?.studentProfile?.skills, []);
  const courses = parseJsonField(profileData?.studentProfile?.completed_courses, []);
  const interests = parseJsonField(profileData?.studentProfile?.interests, []);
  const projects = parseJsonField(profileData?.studentProfile?.projects, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden bg-gray-50">
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Send Your Profile to the Unit
          </h2>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || isLoading || !profileData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Sending...' : 'Send Profile'}
          </Button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-100px)]">
          {/* Left Sidebar - Checkboxes */}
          <div className="w-80 bg-white border-r border-gray-200 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={sections.personal_details} 
                  disabled 
                  className="data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-400"
                />
                <span className="text-gray-700 font-medium">Personal Details</span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={sections.profile_summary} 
                  disabled 
                  className="data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-400"
                />
                <span className="text-gray-700 font-medium">Profile Summary</span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={sections.courses} 
                  disabled 
                  className="data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-400"
                />
                <span className="text-gray-700 font-medium">Courses</span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={sections.key_skills} 
                  disabled 
                  className="data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-400"
                />
                <span className="text-gray-700 font-medium">Key Skills</span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={sections.education} 
                  disabled 
                  className="data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-400"
                />
                <span className="text-gray-700 font-medium">Education</span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={sections.interests} 
                  disabled 
                  className="data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-400"
                />
                <span className="text-gray-700 font-medium">Interests</span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={sections.projects} 
                  onCheckedChange={(checked) => 
                    setSections(prev => ({ ...prev, projects: checked === true }))
                  }
                />
                <span className="text-gray-700 font-medium">Projects</span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={sections.internship} 
                  onCheckedChange={(checked) => 
                    setSections(prev => ({ ...prev, internship: checked === true }))
                  }
                />
                <span className="text-gray-700 font-medium">Internship</span>
              </div>
            </div>
          </div>

          {/* Right Content - Profile Preview */}
          <ScrollArea className="flex-1">
            <div className="p-8 space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="animate-pulse bg-gray-200 h-8 rounded w-3/4"></div>
                  <div className="animate-pulse bg-gray-200 h-24 rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-24 rounded"></div>
                </div>
              ) : profileData ? (
                <>
                  {/* Header Card */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {profileData.profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {profileData.profile.full_name || 'Not provided'}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {profileData.studentProfile?.bio || 'No bio available'}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {profileData.profile.email || 'Not provided'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {profileData.profile.phone || 'Not provided'}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {profileData.studentProfile?.location || profileData.profile.address || 'Not provided'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Details */}
                  {sections.personal_details && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Personal</p>
                          <p className="text-gray-900">
                            {profileData.profile.gender || 'Not specified'}, {profileData.profile.marital_status || 'Single/ Unmarried'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Graduated</p>
                          <p className="text-gray-900">
                            {profileData.education?.some((edu: any) => !edu.end_year) ? 'No' : 'Yes'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Date Of Birth</p>
                          <p className="text-gray-900">{formatDate(profileData.profile.date_of_birth)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Differently Abled</p>
                          <p className="text-gray-900">{profileData.profile.differently_abled ? 'Yes' : 'No'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500 mb-1">Address</p>
                          <p className="text-gray-900">{profileData.profile.address || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Profile Summary */}
                  {sections.profile_summary && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Profile Summary</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {profileData.studentProfile?.cover_letter || 'No profile summary available'}
                      </p>
                    </div>
                  )}

                  {/* Courses */}
                  {sections.courses && courses.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Courses</h3>
                      <div className="space-y-3">
                        {courses.map((course: any, index: number) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-semibold text-gray-900">{course.title || course.name}</h4>
                            <p className="text-sm text-gray-600">{course.provider || 'Provider not specified'}</p>
                            {course.completion_date && (
                              <p className="text-xs text-gray-500">Completed: {formatDate(course.completion_date)}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Skills */}
                  {sections.key_skills && skills.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Key Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill: any, index: number) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                          >
                            {typeof skill === 'string' ? skill : skill.name || skill.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {sections.education && profileData.education.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Education</h3>
                      <div className="space-y-4">
                        {profileData.education.map((edu: any) => (
                          <div key={edu.id} className="border-l-4 border-green-500 pl-4">
                            <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                            <p className="text-gray-700">{edu.institution}</p>
                            <p className="text-sm text-gray-600">
                              {edu.start_year} - {edu.end_year || 'Present'}
                              {edu.score && ` • ${edu.score}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interests */}
                  {sections.interests && interests.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest: string, index: number) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {sections.projects && projects.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Projects</h3>
                      <div className="space-y-4">
                        {projects.map((project: any, index: number) => (
                          <div key={index} className="border-l-4 border-orange-500 pl-4">
                            <h4 className="font-semibold text-gray-900">{project.title}</h4>
                            <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                            {project.technologies && (
                              <div className="flex flex-wrap gap-1">
                                {(Array.isArray(project.technologies) ? project.technologies : [project.technologies]).map((tech: string, i: number) => (
                                  <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Internship History */}
                  {sections.internship && profileData.internships.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Internship History</h3>
                      <div className="space-y-4">
                        {profileData.internships.map((internship: any) => (
                          <div key={internship.id} className="border-l-4 border-teal-500 pl-4">
                            <h4 className="font-semibold text-gray-900">{internship.role}</h4>
                            <p className="text-gray-700">{internship.company}</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(internship.start_date)} - {internship.end_date ? formatDate(internship.end_date) : 'Present'}
                            </p>
                            {internship.description && (
                              <p className="text-sm text-gray-600 mt-1">{internship.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No profile data available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSummaryDialog;
