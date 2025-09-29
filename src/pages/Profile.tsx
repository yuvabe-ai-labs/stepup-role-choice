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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import { Edit, Mail, Phone, MapPin, Plus, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  profile_summary: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  address: string;
  graduated: boolean;
  differently_abled: boolean;
  avatar_url?: string;
}

interface Course {
  id: string;
  profile_id: string;
  title: string;
  provider: string;
  completed_date: string;
}

interface Skill {
  id: string;
  profile_id: string;
  name: string;
}

interface Education {
  id: string;
  profile_id: string;
  degree: string;
  institution: string;
  start_year: string;
  end_year: string;
  grade: string;
  education_type: string;
}

interface Internship {
  id: string;
  profile_id: string;
  title: string;
  company: string;
  start_date?: string;
  end_date?: string;
}

interface Language {
  id: string;
  profile_id: string;
  name: string;
  proficiency: number;
  read: number;
  write: number;
  speak: number;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit states
  const [editingProfile, setEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<Profile>>({});
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<any>(null);

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

      if (profileData) {
        // Fetch courses
        const { data: coursesData } = await supabase
          .from('courses')
          .select('*')
          .eq('profile_id', profileData.id);
        setCourses(coursesData || []);

        // Fetch skills
        const { data: skillsData } = await supabase
          .from('skills')
          .select('*')
          .eq('profile_id', profileData.id);
        setSkills(skillsData || []);

        // Fetch education
        const { data: educationData } = await supabase
          .from('education')
          .select('*')
          .eq('profile_id', profileData.id)
          .order('start_year', { ascending: false });
        setEducation(educationData || []);

        // Fetch internships
        const { data: internshipsData } = await supabase
          .from('internships')
          .select('*')
          .eq('profile_id', profileData.id);
        setInternships(internshipsData || []);

        // Fetch languages
        const { data: languagesData } = await supabase
          .from('languages')
          .select('*')
          .eq('profile_id', profileData.id);
        setLanguages(languagesData || []);
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

      setProfile({ ...profile, ...editedProfile });
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

  const addCourse = async (course: Omit<Course, 'id' | 'profile_id'>) => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({ ...course, profile_id: profile.id })
        .select()
        .single();

      if (error) throw error;
      setCourses([...courses, data]);
      setDialogOpen(null);
      toast({ title: "Success", description: "Course added successfully" });
    } catch (error) {
      console.error('Error adding course:', error);
      toast({ title: "Error", description: "Failed to add course", variant: "destructive" });
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      setCourses(courses.filter(c => c.id !== id));
      toast({ title: "Success", description: "Course deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete course", variant: "destructive" });
    }
  };

  const addSkill = async (skillName: string) => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('skills')
        .insert({ name: skillName, profile_id: profile.id })
        .select()
        .single();

      if (error) throw error;
      setSkills([...skills, data]);
      setDialogOpen(null);
      toast({ title: "Success", description: "Skill added successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add skill", variant: "destructive" });
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
      setSkills(skills.filter(s => s.id !== id));
      toast({ title: "Success", description: "Skill deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete skill", variant: "destructive" });
    }
  };

  const addEducation = async (edu: Omit<Education, 'id' | 'profile_id'>) => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('education')
        .insert({ ...edu, profile_id: profile.id })
        .select()
        .single();

      if (error) throw error;
      setEducation([...education, data].sort((a, b) => b.start_year.localeCompare(a.start_year)));
      setDialogOpen(null);
      toast({ title: "Success", description: "Education added successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add education", variant: "destructive" });
    }
  };

  const deleteEducation = async (id: string) => {
    try {
      const { error } = await supabase.from('education').delete().eq('id', id);
      if (error) throw error;
      setEducation(education.filter(e => e.id !== id));
      toast({ title: "Success", description: "Education deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete education", variant: "destructive" });
    }
  };

  const addInternship = async (internship: Omit<Internship, 'id' | 'profile_id'>) => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('internships')
        .insert({ ...internship, profile_id: profile.id })
        .select()
        .single();

      if (error) throw error;
      setInternships([...internships, data]);
      setDialogOpen(null);
      toast({ title: "Success", description: "Internship added successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add internship", variant: "destructive" });
    }
  };

  const deleteInternship = async (id: string) => {
    try {
      const { error } = await supabase.from('internships').delete().eq('id', id);
      if (error) throw error;
      setInternships(internships.filter(i => i.id !== id));
      toast({ title: "Success", description: "Internship deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete internship", variant: "destructive" });
    }
  };

  const addLanguage = async (lang: Omit<Language, 'id' | 'profile_id'>) => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('languages')
        .insert({ ...lang, profile_id: profile.id })
        .select()
        .single();

      if (error) throw error;
      setLanguages([...languages, data]);
      setDialogOpen(null);
      toast({ title: "Success", description: "Language added successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add language", variant: "destructive" });
    }
  };

  const deleteLanguage = async (id: string) => {
    try {
      const { error } = await supabase.from('languages').delete().eq('id', id);
      if (error) throw error;
      setLanguages(languages.filter(l => l.id !== id));
      toast({ title: "Success", description: "Language deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete language", variant: "destructive" });
    }
  };

  const renderProficiencyDots = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          i < level ? 'bg-primary' : 'bg-muted'
        }`}
      />
    ));
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
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
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
                    <div className="grid grid-cols-3 gap-2">
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
                      <Input
                        value={editedProfile.location || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                        placeholder="Location"
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
                      <h1 className="text-2xl font-bold">{profile?.full_name || 'Student Name'}</h1>
                      <Edit 
                        className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" 
                        onClick={() => setEditingProfile(true)}
                      />
                    </div>
                    <p className="text-muted-foreground mb-4">{profile?.role || 'Add your role'}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{profile?.email || user?.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{profile?.phone || 'Add phone'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile?.location || 'Add location'}</span>
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
                    <span className="text-sm">Profile Summary</span>
                    <Button variant="ghost" size="sm" className="text-primary p-0 h-auto" onClick={() => setDialogOpen('summary')}>
                      Update
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Courses</span>
                    <Button variant="ghost" size="sm" className="text-primary p-0 h-auto" onClick={() => setDialogOpen('course')}>
                      Add
                    </Button>
                  </div>
                  <div className="text-sm">Key Skills</div>
                  <div className="text-sm">Education</div>
                  <div className="text-sm">Projects</div>
                  <div className="text-sm">Interests</div>
                  <div className="text-sm">Internships</div>
                  <div className="text-sm">Personal Details</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Profile Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Profile Summary</h3>
                  <Edit 
                    className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" 
                    onClick={() => setDialogOpen('summary')}
                  />
                </div>
                <p className="text-muted-foreground">
                  {profile?.profile_summary || 'Add a professional summary about yourself...'}
                </p>
              </CardContent>
            </Card>

            {/* Completed Courses */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Completed Courses</h3>
                  <Button variant="ghost" size="sm" className="text-primary" onClick={() => setDialogOpen('course')}>
                    Add Completed Course
                  </Button>
                </div>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium">{course.title}</h4>
                        <p className="text-sm text-muted-foreground">{course.provider}</p>
                        <p className="text-sm text-muted-foreground">Completed on {new Date(course.completed_date).toLocaleDateString()}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => deleteCourse(course.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {courses.length === 0 && (
                    <p className="text-muted-foreground">No courses added yet. Add your completed courses to showcase your learning.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Key Skills */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Key Skills</h3>
                  <Button variant="ghost" size="sm" className="text-primary" onClick={() => setDialogOpen('skill')}>
                    Add Skill
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="px-3 py-1 group cursor-pointer" onClick={() => deleteSkill(skill.id)}>
                      {skill.name}
                      <X className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100" />
                    </Badge>
                  ))}
                  {skills.length === 0 && (
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
                  <Button variant="ghost" size="sm" className="text-primary" onClick={() => setDialogOpen('education')}>
                    Add Education
                  </Button>
                </div>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <div>
                          <p className="text-sm">{edu.start_year} - {edu.end_year}</p>
                          <p className="text-sm text-primary font-medium">{edu.grade}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => deleteEducation(edu.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {education.length === 0 && (
                    <p className="text-muted-foreground">Add your educational background.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Internships */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Internships</h3>
                  <Button variant="ghost" size="sm" className="text-primary" onClick={() => setDialogOpen('internship')}>
                    Add Internship
                  </Button>
                </div>
                <div className="space-y-4">
                  {internships.map((internship) => (
                    <div key={internship.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium">{internship.title}</h4>
                        <p className="text-sm text-muted-foreground">{internship.company}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => deleteInternship(internship.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {internships.length === 0 && (
                    <p className="text-muted-foreground">Stand out by adding details about internships you have done.</p>
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
                    <p className="text-sm text-muted-foreground mb-1">Personal</p>
                    <p className="font-medium">{profile?.gender}, {profile?.marital_status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Graduated</p>
                    <p className="font-medium">{profile?.graduated ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date Of Birth</p>
                    <p className="font-medium">{profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Differently Abled</p>
                    <p className="font-medium">{profile?.differently_abled ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-1">Address</p>
                  <p className="font-medium">{profile?.address || 'Add your address'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Languages</h3>
                  <Button variant="ghost" size="sm" className="text-primary" onClick={() => setDialogOpen('language')}>
                    Add Language
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-6 gap-4 text-sm text-muted-foreground mb-2">
                    <span>Language</span>
                    <span>Proficiency</span>
                    <span>Read</span>
                    <span>Write</span>
                    <span>Speak</span>
                    <span></span>
                  </div>
                  {languages.map((lang) => (
                    <div key={lang.id} className="grid grid-cols-6 gap-4 items-center">
                      <span className="font-medium">{lang.name}</span>
                      <div className="flex space-x-1">
                        {renderProficiencyDots(lang.proficiency)}
                      </div>
                      <div className="flex space-x-1">
                        {renderProficiencyDots(lang.read)}
                      </div>
                      <div className="flex space-x-1">
                        {renderProficiencyDots(lang.write)}
                      </div>
                      <div className="flex space-x-1">
                        {renderProficiencyDots(lang.speak)}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => deleteLanguage(lang.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {languages.length === 0 && (
                    <p className="text-muted-foreground">Add languages you know.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ProfileSummaryDialog 
        open={dialogOpen === 'summary'} 
        onClose={() => setDialogOpen(null)}
        profile={profile}
        onSave={async (summary) => {
          if (!profile) return;
          const { error } = await supabase
            .from('profiles')
            .update({ profile_summary: summary })
            .eq('id', profile.id);
          if (!error) {
            setProfile({ ...profile, profile_summary: summary });
            setDialogOpen(null);
            toast({ title: "Success", description: "Profile summary updated" });
          }
        }}
      />

      <CourseDialog
        open={dialogOpen === 'course'}
        onClose={() => setDialogOpen(null)}
        onSave={addCourse}
      />

      <SkillDialog
        open={dialogOpen === 'skill'}
        onClose={() => setDialogOpen(null)}
        onSave={addSkill}
      />

      <EducationDialog
        open={dialogOpen === 'education'}
        onClose={() => setDialogOpen(null)}
        onSave={addEducation}
      />

      <InternshipDialog
        open={dialogOpen === 'internship'}
        onClose={() => setDialogOpen(null)}
        onSave={addInternship}
      />

      <LanguageDialog
        open={dialogOpen === 'language'}
        onClose={() => setDialogOpen(null)}
        onSave={addLanguage}
      />

      <PersonalDetailsDialog
        open={dialogOpen === 'personal'}
        onClose={() => setDialogOpen(null)}
        profile={profile}
        onSave={async (details) => {
          if (!profile) return;
          const { error } = await supabase
            .from('profiles')
            .update(details)
            .eq('id', profile.id);
          if (!error) {
            setProfile({ ...profile, ...details });
            setDialogOpen(null);
            toast({ title: "Success", description: "Personal details updated" });
          }
        }}
      />
    </div>
  );
};

// Dialog Components
const ProfileSummaryDialog = ({ open, onClose, profile, onSave }: any) => {
  const [summary, setSummary] = useState(profile?.profile_summary || '');

  useEffect(() => {
    setSummary(profile?.profile_summary || '');
  }, [profile]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile Summary</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Write a brief summary about yourself..."
            rows={6}
          />
          <Button onClick={() => onSave(summary)} className="w-full">
            Save Summary
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CourseDialog = ({ open, onClose, onSave }: any) => {
  const [course, setCourse] = useState({ title: '', provider: '', completed_date: '' });

  const handleSave = () => {
    if (course.title && course.provider && course.completed_date) {
      onSave(course);
      setCourse({ title: '', provider: '', completed_date: '' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Completed Course</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Course Title</Label>
            <Input
              value={course.title}
              onChange={(e) => setCourse({ ...course, title: e.target.value })}
              placeholder="e.g., Digital Marketing"
            />
          </div>
          <div>
            <Label>Provider</Label>
            <Input
              value={course.provider}
              onChange={(e) => setCourse({ ...course, provider: e.target.value })}
              placeholder="e.g., Coursera, Udemy"
            />
          </div>
          <div>
            <Label>Completion Date</Label>
            <Input
              type="date"
              value={course.completed_date}
              onChange={(e) => setCourse({ ...course, completed_date: e.target.value })}
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Add Course
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SkillDialog = ({ open, onClose, onSave }: any) => {
  const [skillName, setSkillName] = useState('');

  const handleSave = () => {
    if (skillName) {
      onSave(skillName);
      setSkillName('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Skill</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Skill Name</Label>
            <Input
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="e.g., React, Python, Design"
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Add Skill
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EducationDialog = ({ open, onClose, onSave }: any) => {
  const [edu, setEdu] = useState({
    degree: '',
    institution: '',
    start_year: '',
    end_year: '',
    grade: '',
    education_type: 'undergraduate'
  });

  const handleSave = () => {
    if (edu.degree && edu.institution && edu.start_year && edu.end_year) {
      onSave(edu);
      setEdu({ degree: '', institution: '', start_year: '', end_year: '', grade: '', education_type: 'undergraduate' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Education</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Education Type</Label>
            <Select value={edu.education_type} onValueChange={(value) => setEdu({ ...edu, education_type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high-school">High School</SelectItem>
                <SelectItem value="undergraduate">Undergraduate</SelectItem>
                <SelectItem value="postgraduate">Postgraduate</SelectItem>
                <SelectItem value="doctorate">Doctorate/PhD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Degree/Certificate</Label>
            <Input
              value={edu.degree}
              onChange={(e) => setEdu({ ...edu, degree: e.target.value })}
              placeholder="e.g., Bachelor of Science"
            />
          </div>
          <div>
            <Label>Institution</Label>
            <Input
              value={edu.institution}
              onChange={(e) => setEdu({ ...edu, institution: e.target.value })}
              placeholder="e.g., University Name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Year</Label>
              <Input
                value={edu.start_year}
                onChange={(e) => setEdu({ ...edu, start_year: e.target.value })}
                placeholder="e.g., 2020"
              />
            </div>
            <div>
              <Label>End Year</Label>
              <Input
                value={edu.end_year}
                onChange={(e) => setEdu({ ...edu, end_year: e.target.value })}
                placeholder="e.g., 2024"
              />
            </div>
          </div>
          <div>
            <Label>Grade/CGPA</Label>
            <Input
              value={edu.grade}
              onChange={(e) => setEdu({ ...edu, grade: e.target.value })}
              placeholder="e.g., 8.5 CGPA or 85%"
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Add Education
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const InternshipDialog = ({ open, onClose, onSave }: any) => {
  const [internship, setInternship] = useState({
    title: '',
    company: '',
    start_date: '',
    end_date: ''
  });

  const handleSave = () => {
    if (internship.title && internship.company) {
      onSave(internship);
      setInternship({ title: '', company: '', start_date: '', end_date: '' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Internship</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Position/Title</Label>
            <Input
              value={internship.title}
              onChange={(e) => setInternship({ ...internship, title: e.target.value })}
              placeholder="e.g., Software Engineer Intern"
            />
          </div>
          <div>
            <Label>Company</Label>
            <Input
              value={internship.company}
              onChange={(e) => setInternship({ ...internship, company: e.target.value })}
              placeholder="e.g., Tech Corp"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={internship.start_date}
                onChange={(e) => setInternship({ ...internship, start_date: e.target.value })}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={internship.end_date}
                onChange={(e) => setInternship({ ...internship, end_date: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleSave} className="w-full">
            Add Internship
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const LanguageDialog = ({ open, onClose, onSave }: any) => {
  const [lang, setLang] = useState({
    name: '',
    proficiency: 3,
    read: 3,
    write: 3,
    speak: 3
  });

  const handleSave = () => {
    if (lang.name) {
      onSave(lang);
      setLang({ name: '', proficiency: 3, read: 3, write: 3, speak: 3 });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Language</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Language Name</Label>
            <Input
              value={lang.name}
              onChange={(e) => setLang({ ...lang, name: e.target.value })}
              placeholder="e.g., English, Spanish"
            />
          </div>
          <div>
            <Label>Overall Proficiency: {lang.proficiency}/5</Label>
            <Input
              type="range"
              min="1"
              max="5"
              value={lang.proficiency}
              onChange={(e) => setLang({ ...lang, proficiency: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <Label>Read: {lang.read}/5</Label>
            <Input
              type="range"
              min="1"
              max="5"
              value={lang.read}
              onChange={(e) => setLang({ ...lang, read: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <Label>Write: {lang.write}/5</Label>
            <Input
              type="range"
              min="1"
              max="5"
              value={lang.write}
              onChange={(e) => setLang({ ...lang, write: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <Label>Speak: {lang.speak}/5</Label>
            <Input
              type="range"
              min="1"
              max="5"
              value={lang.speak}
              onChange={(e) => setLang({ ...lang, speak: parseInt(e.target.value) })}
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Add Language
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PersonalDetailsDialog = ({ open, onClose, profile, onSave }: any) => {
  const [details, setDetails] = useState({
    gender: profile?.gender || '',
    marital_status: profile?.marital_status || '',
    date_of_birth: profile?.date_of_birth || '',
    graduated: profile?.graduated || false,
    differently_abled: profile?.differently_abled || false,
    address: profile?.address || ''
  });

  useEffect(() => {
    if (profile) {
      setDetails({
        gender: profile.gender || '',
        marital_status: profile.marital_status || '',
        date_of_birth: profile.date_of_birth || '',
        graduated: profile.graduated || false,
        differently_abled: profile.differently_abled || false,
        address: profile.address || ''
      });
    }
  }, [profile]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Personal Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Gender</Label>
              <Select value={details.gender} onValueChange={(value) => setDetails({ ...details, gender: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Marital Status</Label>
              <Select value={details.marital_status} onValueChange={(value) => setDetails({ ...details, marital_status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Date of Birth</Label>
            <Input
              type="date"
              value={details.date_of_birth}
              onChange={(e) => setDetails({ ...details, date_of_birth: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="graduated"
              checked={details.graduated}
              onChange={(e) => setDetails({ ...details, graduated: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="graduated">Graduated</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="differently_abled"
              checked={details.differently_abled}
              onChange={(e) => setDetails({ ...details, differently_abled: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="differently_abled">Differently Abled</Label>
          </div>
          <div>
            <Label>Address</Label>
            <Textarea
              value={details.address}
              onChange={(e) => setDetails({ ...details, address: e.target.value })}
              placeholder="Enter your full address"
              rows={3}
            />
          </div>
          <Button onClick={() => onSave(details)} className="w-full">
            Save Personal Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Profile;