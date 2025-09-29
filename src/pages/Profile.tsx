// import { useAuth } from '@/hooks/useAuth';
// import { useEffect, useState } from 'react';
// import { supabase } from '@/integrations/supabase/client';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import Navbar from '@/components/Navbar';
// import { Edit, Mail, Phone, MapPin, Plus } from 'lucide-react';

// interface Profile {
//   id: string;
//   full_name: string;
//   role: string;
//   created_at: string;
// }

// const Profile = () => {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState<Profile | null>(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!user) return;

//       try {
//         const { data, error } = await supabase
//           .from('profiles')
//           .select('*')
//           .eq('user_id', user.id)
//           .maybeSingle();

//         if (!error && data) {
//           setProfile(data);
//         }
//       } catch (error) {
//         console.error('Error fetching profile:', error);
//       }
//     };

//     fetchProfile();
//   }, [user]);

//   const quickLinks = [
//     { name: 'Profile Summary', action: 'Update' },
//     { name: 'Courses', action: 'Add' },
//     { name: 'Key Skills', action: '' },
//     { name: 'Education', action: '' },
//     { name: 'Projects', action: 'Add' },
//     { name: 'Interests', action: 'Add' },
//     { name: 'Internships', action: 'Add' },
//     { name: 'Personal Details', action: 'Add' },
//   ];

//   const skills = [
//     'Figma', 'Framer', 'User Interface Design', 'User Experience Design',
//     'Adobe Creative Suite', 'XD Wiring', 'MAYA', 'Information Architecture',
//     'Wireframes', 'WordPress', 'Social Media Ads'
//   ];

//   const languages = [
//     { name: 'English', proficiency: 5, read: 5, write: 4, speak: 5 },
//     { name: 'Tamil', proficiency: 4, read: 2, write: 4, speak: 5 },
//     { name: 'Spanish', proficiency: 3, read: 4, write: 2, speak: 5 },
//   ];

//   const completedCourses = [
//     {
//       title: 'Digital Marketing',
//       provider: 'SkillUp - SkillUp Program',
//       completedDate: 'Apr 30, 2025'
//     },
//     {
//       title: 'Design Intern',
//       provider: 'Bharat Verse',
//       completedDate: 'Dec 16, 2024'
//     }
//   ];

//   const education = [
//     {
//       degree: 'Bachelor of Design (Visual Communication)',
//       institution: 'National Institute of Design',
//       years: '2017 - 2021',
//       cgpa: '8.5 CGPA'
//     },
//     {
//       degree: 'Higher Secondary Certificate',
//       institution: 'St. Mary\'s Higher Secondary School',
//       years: '2015 - 2017',
//       percentage: '94%'
//     }
//   ];

//   const internships = [
//     {
//       title: 'UI/UX Designer',
//       company: 'Aurora Earth Institute'
//     },
//     {
//       title: 'Design Intern',
//       company: 'Bharat Verse'
//     }
//   ];

//   const renderProficiencyDots = (level: number) => {
//     return Array.from({ length: 5 }, (_, i) => (
//       <div
//         key={i}
//         className={`w-2 h-2 rounded-full ${
//           i < level ? 'bg-primary' : 'bg-muted'
//         }`}
//       />
//     ));
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
      
//       {/* Hero Background */}
//       <div className="relative h-48 bg-gradient-to-r from-primary to-primary-foreground">
//         <div className="absolute inset-0 bg-black/20" />
//       </div>

//       <div className="container mx-auto px-4 -mt-24 relative z-10">
//         {/* Profile Header */}
//         <Card className="mb-8 bg-white">
//           <CardContent className="p-6">
//             <div className="flex items-start space-x-6">
//               <Avatar className="h-24 w-24 ring-4 ring-white">
//                 <AvatarImage src="" />
//                 <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
//                   {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
//                 </AvatarFallback>
//               </Avatar>
              
//               <div className="flex-1">
//                 <div className="flex items-center space-x-2 mb-2">
//                   <h1 className="text-2xl font-bold">{profile?.full_name || 'Student Name'}</h1>
//                   <Edit className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
//                 </div>
//                 <p className="text-muted-foreground mb-4">
//                   {profile?.role || 'Digital Marketing Associate | Canva Expert | AI Prompt Writer'}
//                 </p>
                
//                 <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
//                   <div className="flex items-center space-x-1">
//                     <Mail className="w-4 h-4" />
//                     <span>{user?.email || 'student@gmail.com'}</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <Phone className="w-4 h-4" />
//                     <span>+91 98764 44200</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <MapPin className="w-4 h-4" />
//                     <span>Coimbatore, Tamil Nadu</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <div className="grid lg:grid-cols-4 gap-8">
//           {/* Left Sidebar - Quick Links */}
//           <div className="lg:col-span-1">
//             <Card>
//               <CardContent className="p-6">
//                 <h3 className="font-semibold mb-4">Quick Links</h3>
//                 <div className="space-y-3">
//                   {quickLinks.map((link, index) => (
//                     <div key={index} className="flex items-center justify-between">
//                       <span className="text-sm">{link.name}</span>
//                       {link.action && (
//                         <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
//                           {link.action}
//                         </Button>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-3 space-y-8">
//             {/* Profile Summary */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold">Profile Summary</h3>
//                   <Edit className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
//                 </div>
//                 <p className="text-muted-foreground">
//                   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse lorem vehicula consequat. 
//                   Vivamus magna velit, finibus sed sodales dapibus sed, sodales fermentum lorem. Mauris dignissim tortor quis neque 
//                   ultricies condimentum. Curabitur lobortis condimentum luctus neque, id venenatis tortor semper.
//                 </p>
//               </CardContent>
//             </Card>

//             {/* Completed Courses */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold">Completed Courses</h3>
//                   <Button variant="ghost" size="sm" className="text-primary">
//                     Add Completed Course
//                   </Button>
//                 </div>
//                 <div className="space-y-4">
//                   {completedCourses.map((course, index) => (
//                     <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
//                       <div>
//                         <h4 className="font-medium">{course.title}</h4>
//                         <p className="text-sm text-muted-foreground">{course.provider}</p>
//                         <p className="text-sm text-muted-foreground">Completed on {course.completedDate}</p>
//                       </div>
//                       <Button variant="outline" size="sm">View</Button>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Key Skills */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold">Key Skills</h3>
//                   <Edit className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {skills.map((skill, index) => (
//                     <Badge key={index} variant="secondary" className="px-3 py-1">
//                       {skill}
//                     </Badge>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Education */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold">Education</h3>
//                   <Button variant="ghost" size="sm" className="text-primary">
//                     Add Education
//                   </Button>
//                 </div>
//                 <div className="space-y-4">
//                   {education.map((edu, index) => (
//                     <div key={index} className="flex items-center justify-between">
//                       <div>
//                         <h4 className="font-medium">{edu.degree}</h4>
//                         <p className="text-sm text-muted-foreground">{edu.institution}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-sm">{edu.years}</p>
//                         <p className="text-sm text-primary font-medium">{edu.cgpa || edu.percentage}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="mt-4 space-y-2">
//                   <Button variant="ghost" size="sm" className="text-primary">
//                     Add Master/ Post-graduate
//                   </Button>
//                   <br />
//                   <Button variant="ghost" size="sm" className="text-primary">
//                     Add Doctorate/ PhD
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Projects */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold">Projects</h3>
//                   <Button variant="ghost" size="sm" className="text-primary">
//                     Add Project
//                   </Button>
//                 </div>
//                 <p className="text-muted-foreground">
//                   Stand out by adding details about the projects that you have done so far.
//                 </p>
//               </CardContent>
//             </Card>

//             {/* Interests */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold">Interests</h3>
//                   <Button variant="ghost" size="sm" className="text-primary">
//                     Add Interest
//                   </Button>
//                 </div>
//                 <p className="text-muted-foreground">
//                   Stand out by telling about your interests.
//                 </p>
//               </CardContent>
//             </Card>

//             {/* Internships */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold">Internships</h3>
//                   <Button variant="ghost" size="sm" className="text-primary">
//                     Add Internship
//                   </Button>
//                 </div>
//                 <div className="space-y-4">
//                   {internships.map((internship, index) => (
//                     <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
//                       <div>
//                         <h4 className="font-medium">{internship.title}</h4>
//                         <p className="text-sm text-muted-foreground">{internship.company}</p>
//                       </div>
//                       <Button variant="outline" size="sm">View</Button>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Personal Details */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold">Personal Details</h3>
//                   <Edit className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
//                 </div>
//                 <div className="grid grid-cols-2 gap-6">
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Personal</p>
//                     <p className="font-medium">Male, Single/ Unmarried</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Graduated</p>
//                     <p className="font-medium">No</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Date Of Birth</p>
//                     <p className="font-medium">19 Aug 2006</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">Differently Abled</p>
//                     <p className="font-medium">No</p>
//                   </div>
//                 </div>
//                 <div className="mt-4">
//                   <p className="text-sm text-muted-foreground mb-1">Address</p>
//                   <p className="font-medium">No. 34, French Colony Street, Gandhi Nagar, Coimbatore, Tamil Nadu - 600 235</p>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Languages */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold">Languages</h3>
//                   <Button variant="ghost" size="sm" className="text-primary">
//                     Add Languages
//                   </Button>
//                 </div>
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-5 gap-4 text-sm text-muted-foreground mb-2">
//                     <span>Language</span>
//                     <span>Proficiency</span>
//                     <span>Read</span>
//                     <span>Write</span>
//                     <span>Speak</span>
//                   </div>
//                   {languages.map((lang, index) => (
//                     <div key={index} className="grid grid-cols-5 gap-4 items-center">
//                       <span className="font-medium">{lang.name}</span>
//                       <div className="flex space-x-1">
//                         {renderProficiencyDots(lang.proficiency)}
//                       </div>
//                       <div className="flex space-x-1">
//                         {renderProficiencyDots(lang.read)}
//                       </div>
//                       <div className="flex space-x-1">
//                         {renderProficiencyDots(lang.write)}
//                       </div>
//                       <div className="flex space-x-1">
//                         {renderProficiencyDots(lang.speak)}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import { Edit, Mail, Phone, MapPin, Save, X, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth: string;
  gender: string;
  profile_type: string;
  skills: string[];
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  progress: number;
  completed_at?: string;
  enrolled_at: string;
}

interface Education {
  id: string;
  user_id: string;
  degree: string;
  institution: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  grade?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [completedCourses, setCompletedCourses] = useState<any[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit states
  const [editingProfile, setEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<Profile>>({});
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [profileSummary, setProfileSummary] = useState('');
  const [personalDetails, setPersonalDetails] = useState({
    gender: '',
    date_of_birth: '',
    address: ''
  });
  const [newEducation, setNewEducation] = useState({
    degree: '',
    institution: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    grade: '',
    description: ''
  });

  useEffect(() => {
    fetchAllData();
  }, [user]);

  const fetchAllData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);
      setEditedProfile(profileData);
      setPersonalDetails({
        gender: profileData.gender || '',
        date_of_birth: profileData.date_of_birth || '',
        address: profileData.address || ''
      });

      if (profileData) {
        // Fetch completed course enrollments with course details
        const { data: enrollmentsData } = await supabase
          .from('course_enrollments')
          .select(`
            *,
            courses (
              id,
              title,
              provider,
              description
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'completed');
        
        setCompletedCourses(enrollmentsData || []);

        // Fetch education
        const { data: educationData } = await supabase
          .from('education')
          .select('*')
          .eq('user_id', user.id)
          .order('start_date', { ascending: false });
        
        setEducation(educationData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(editedProfile)
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, ...editedProfile } as Profile);
      setEditingProfile(false);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const addSkill = async () => {
    if (!profile || !newSkill.trim()) return;

    try {
      const updatedSkills = [...(profile.skills || []), newSkill.trim()];
      const { error } = await supabase
        .from('profiles')
        .update({ skills: updatedSkills })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, skills: updatedSkills });
      setNewSkill('');
      setDialogOpen(null);
      toast({ title: "Success", description: "Skill added successfully" });
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({ title: "Error", description: "Failed to add skill", variant: "destructive" });
    }
  };

  const removeSkill = async (skillToRemove: string) => {
    if (!profile) return;

    try {
      const updatedSkills = profile.skills.filter(s => s !== skillToRemove);
      const { error } = await supabase
        .from('profiles')
        .update({ skills: updatedSkills })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, skills: updatedSkills });
      toast({ title: "Success", description: "Skill removed successfully" });
    } catch (error) {
      console.error('Error removing skill:', error);
      toast({ title: "Error", description: "Failed to remove skill", variant: "destructive" });
    }
  };

  const addEducation = async () => {
    if (!user) return;
    if (!newEducation.degree || !newEducation.institution || !newEducation.start_date) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('education')
        .insert({
          user_id: user.id,
          ...newEducation
        })
        .select()
        .single();

      if (error) throw error;

      setEducation([data, ...education]);
      setNewEducation({
        degree: '',
        institution: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        grade: '',
        description: ''
      });
      setDialogOpen(null);
      toast({ title: "Success", description: "Education added successfully" });
    } catch (error) {
      console.error('Error adding education:', error);
      toast({ title: "Error", description: "Failed to add education", variant: "destructive" });
    }
  };

  const deleteEducation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEducation(education.filter(e => e.id !== id));
      toast({ title: "Success", description: "Education deleted successfully" });
    } catch (error) {
      console.error('Error deleting education:', error);
      toast({ title: "Error", description: "Failed to delete education", variant: "destructive" });
    }
  };

  const updatePersonalDetails = async () => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(personalDetails)
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, ...personalDetails });
      setDialogOpen(null);
      toast({ title: "Success", description: "Personal details updated successfully" });
    } catch (error) {
      console.error('Error updating personal details:', error);
      toast({ title: "Error", description: "Failed to update personal details", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Profile not found. Please complete onboarding.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Background */}
      <div className="relative h-48 bg-gradient-to-r from-primary to-primary-foreground">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="container mx-auto px-4 -mt-24 relative z-10 pb-12">
        {/* Profile Header */}
        <Card className="mb-8 bg-white">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <Avatar className="h-24 w-24 ring-4 ring-white">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {profile.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                {editingProfile ? (
                  <div className="space-y-4">
                    <Input
                      value={editedProfile.full_name || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })}
                      placeholder="Full Name"
                      className="text-2xl font-bold"
                    />
                    <Input
                      value={editedProfile.role || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, role: e.target.value })}
                      placeholder="Role / Title"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={editedProfile.email || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                        placeholder="Email"
                      />
                      <Input
                        value={editedProfile.phone || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                        placeholder="Phone"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={updateProfile} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={() => setEditingProfile(false)} variant="outline" size="sm">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-2 mb-2">
                      <h1 className="text-2xl font-bold">{profile.full_name || 'Student Name'}</h1>
                      <Edit 
                        className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" 
                        onClick={() => setEditingProfile(true)}
                      />
                    </div>
                    <p className="text-muted-foreground mb-4">{profile.role || 'Add your role'}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{profile.email || user.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{profile.phone || 'Add phone'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.address || 'Add location'}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Quick Links */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Profile Info</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary p-0 h-auto"
                      onClick={() => setEditingProfile(true)}
                    >
                      Update
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Courses</span>
                    <span className="text-xs text-muted-foreground">{completedCourses.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Key Skills</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary p-0 h-auto"
                      onClick={() => setDialogOpen('skill')}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Education</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary p-0 h-auto"
                      onClick={() => setDialogOpen('education')}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Personal Details</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary p-0 h-auto"
                      onClick={() => setDialogOpen('personal')}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Profile Type Badge */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-2">Profile Type</h3>
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      {profile.profile_type === 'student' ? 'Student' : 
                       profile.profile_type === 'educator' ? 'Educator' : 
                       profile.profile_type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Onboarding Status</p>
                    <Badge variant={profile.onboarding_completed ? "default" : "outline"}>
                      {profile.onboarding_completed ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completed Courses */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Completed Courses</h3>
                  <span className="text-sm text-muted-foreground">
                    {completedCourses.length} course{completedCourses.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-4">
                  {completedCourses.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium">{enrollment.courses?.title}</h4>
                        <p className="text-sm text-muted-foreground">{enrollment.courses?.provider}</p>
                        {enrollment.completed_at && (
                          <p className="text-sm text-muted-foreground">
                            Completed on {new Date(enrollment.completed_at).toLocaleDateString()}
                          </p>
                        )}
                        <div className="mt-2">
                          <Badge variant="outline">Progress: {enrollment.progress}%</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {completedCourses.length === 0 && (
                    <p className="text-muted-foreground">No completed courses yet. Start learning to showcase your achievements!</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Key Skills */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Key Skills</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary"
                    onClick={() => setDialogOpen('skill')}
                  >
                    Add Skill
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="px-3 py-1 group cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill}
                        <X className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100" />
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Add your key skills to stand out.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Education</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary"
                    onClick={() => setDialogOpen('education')}
                  >
                    Add Education
                  </Button>
                </div>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex items-start justify-between border-l-2 border-primary pl-4">
                      <div className="flex-1">
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        {edu.field_of_study && (
                          <p className="text-sm text-muted-foreground">Field: {edu.field_of_study}</p>
                        )}
                        <p className="text-sm mt-1">
                          {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}
                        </p>
                        {edu.grade && (
                          <Badge variant="outline" className="mt-2">{edu.grade}</Badge>
                        )}
                        {edu.description && (
                          <p className="text-sm text-muted-foreground mt-2">{edu.description}</p>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteEducation(edu.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {education.length === 0 && (
                    <p className="text-muted-foreground">Add your educational background to strengthen your profile.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Personal Details */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Personal Details</h3>
                  <Edit 
                    className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" 
                    onClick={() => setDialogOpen('personal')}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Gender</p>
                    <p className="font-medium">{profile.gender || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date of Birth</p>
                    <p className="font-medium">
                      {profile.date_of_birth 
                        ? new Date(profile.date_of_birth).toLocaleDateString() 
                        : 'Not specified'}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-1">Address</p>
                  <p className="font-medium">{profile.address || 'Add your address'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Skill Dialog */}
      <Dialog open={dialogOpen === 'skill'} onOpenChange={() => setDialogOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Skill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Skill Name</Label>
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g., React, Python, Design"
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
            </div>
            <Button onClick={addSkill} className="w-full">
              Add Skill
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Education Dialog */}
      <Dialog open={dialogOpen === 'education'} onOpenChange={() => setDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Education</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Degree/Certificate *</Label>
              <Input
                value={newEducation.degree}
                onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                placeholder="e.g., Bachelor of Science"
              />
            </div>
            <div>
              <Label>Institution *</Label>
              <Input
                value={newEducation.institution}
                onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                placeholder="e.g., University Name"
              />
            </div>
            <div>
              <Label>Field of Study</Label>
              <Input
                value={newEducation.field_of_study}
                onChange={(e) => setNewEducation({ ...newEducation, field_of_study: e.target.value })}
                placeholder="e.g., Computer Science"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={newEducation.start_date}
                  onChange={(e) => setNewEducation({ ...newEducation, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={newEducation.end_date}
                  onChange={(e) => setNewEducation({ ...newEducation, end_date: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Grade/CGPA</Label>
              <Input
                value={newEducation.grade}
                onChange={(e) => setNewEducation({ ...newEducation, grade: e.target.value })}
                placeholder="e.g., 8.5 CGPA or 85%"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={newEducation.description}
                onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
                placeholder="Achievements, activities, etc."
                rows={3}
              />
            </div>
            <Button onClick={addEducation} className="w-full">
              Add Education
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Personal Details Dialog */}
      <Dialog open={dialogOpen === 'personal'} onOpenChange={() => setDialogOpen(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Personal Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Gender</Label>
              <Select 
                value={personalDetails.gender} 
                onValueChange={(value) => setPersonalDetails({ ...personalDetails, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                value={personalDetails.date_of_birth}
                onChange={(e) => setPersonalDetails({ ...personalDetails, date_of_birth: e.target.value })}
              />
            </div>
            <div>
              <Label>Address</Label>
              <Textarea
                value={personalDetails.address}
                onChange={(e) => setPersonalDetails({ ...personalDetails, address: e.target.value })}
                placeholder="Enter your full address"
                rows={3}
              />
            </div>
            <Button onClick={updatePersonalDetails} className="w-full">
              Save Personal Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;