import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { Edit, Mail, Phone, MapPin, Plus } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!error && data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  const quickLinks = [
    { name: 'Profile Summary', action: 'Update' },
    { name: 'Courses', action: 'Add' },
    { name: 'Key Skills', action: '' },
    { name: 'Education', action: '' },
    { name: 'Projects', action: 'Add' },
    { name: 'Interests', action: 'Add' },
    { name: 'Internships', action: 'Add' },
    { name: 'Personal Details', action: 'Add' },
  ];

  const skills = [
    'Figma', 'Framer', 'User Interface Design', 'User Experience Design',
    'Adobe Creative Suite', 'XD Wiring', 'MAYA', 'Information Architecture',
    'Wireframes', 'WordPress', 'Social Media Ads'
  ];

  const languages = [
    { name: 'English', proficiency: 5, read: 5, write: 4, speak: 5 },
    { name: 'Tamil', proficiency: 4, read: 2, write: 4, speak: 5 },
    { name: 'Spanish', proficiency: 3, read: 4, write: 2, speak: 5 },
  ];

  const completedCourses = [
    {
      title: 'Digital Marketing',
      provider: 'SkillUp - SkillUp Program',
      completedDate: 'Apr 30, 2025'
    },
    {
      title: 'Design Intern',
      provider: 'Bharat Verse',
      completedDate: 'Dec 16, 2024'
    }
  ];

  const education = [
    {
      degree: 'Bachelor of Design (Visual Communication)',
      institution: 'National Institute of Design',
      years: '2017 - 2021',
      cgpa: '8.5 CGPA'
    },
    {
      degree: 'Higher Secondary Certificate',
      institution: 'St. Mary\'s Higher Secondary School',
      years: '2015 - 2017',
      percentage: '94%'
    }
  ];

  const internships = [
    {
      title: 'UI/UX Designer',
      company: 'Aurora Earth Institute'
    },
    {
      title: 'Design Intern',
      company: 'Bharat Verse'
    }
  ];

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Background */}
      <div className="relative h-48 bg-gradient-to-r from-primary to-primary-foreground">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="container mx-auto px-4 -mt-24 relative z-10">
        {/* Profile Header */}
        <Card className="mb-8 bg-white">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <Avatar className="h-24 w-24 ring-4 ring-white">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-2xl font-bold">{profile?.full_name || 'Student Name'}</h1>
                  <Edit className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                </div>
                <p className="text-muted-foreground mb-4">
                  {profile?.role || 'Digital Marketing Associate | Canva Expert | AI Prompt Writer'}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{user?.email || 'student@gmail.com'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>+91 98764 44200</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>Coimbatore, Tamil Nadu</span>
                  </div>
                </div>
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
                  {quickLinks.map((link, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{link.name}</span>
                      {link.action && (
                        <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                          {link.action}
                        </Button>
                      )}
                    </div>
                  ))}
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
                  <Edit className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                </div>
                <p className="text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse lorem vehicula consequat. 
                  Vivamus magna velit, finibus sed sodales dapibus sed, sodales fermentum lorem. Mauris dignissim tortor quis neque 
                  ultricies condimentum. Curabitur lobortis condimentum luctus neque, id venenatis tortor semper.
                </p>
              </CardContent>
            </Card>

            {/* Completed Courses */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Completed Courses</h3>
                  <Button variant="ghost" size="sm" className="text-primary">
                    Add Completed Course
                  </Button>
                </div>
                <div className="space-y-4">
                  {completedCourses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium">{course.title}</h4>
                        <p className="text-sm text-muted-foreground">{course.provider}</p>
                        <p className="text-sm text-muted-foreground">Completed on {course.completedDate}</p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Skills */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Key Skills</h3>
                  <Edit className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Education</h3>
                  <Button variant="ghost" size="sm" className="text-primary">
                    Add Education
                  </Button>
                </div>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{edu.years}</p>
                        <p className="text-sm text-primary font-medium">{edu.cgpa || edu.percentage}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2">
                  <Button variant="ghost" size="sm" className="text-primary">
                    Add Master/ Post-graduate
                  </Button>
                  <br />
                  <Button variant="ghost" size="sm" className="text-primary">
                    Add Doctorate/ PhD
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Projects</h3>
                  <Button variant="ghost" size="sm" className="text-primary">
                    Add Project
                  </Button>
                </div>
                <p className="text-muted-foreground">
                  Stand out by adding details about the projects that you have done so far.
                </p>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Interests</h3>
                  <Button variant="ghost" size="sm" className="text-primary">
                    Add Interest
                  </Button>
                </div>
                <p className="text-muted-foreground">
                  Stand out by telling about your interests.
                </p>
              </CardContent>
            </Card>

            {/* Internships */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Internships</h3>
                  <Button variant="ghost" size="sm" className="text-primary">
                    Add Internship
                  </Button>
                </div>
                <div className="space-y-4">
                  {internships.map((internship, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium">{internship.title}</h4>
                        <p className="text-sm text-muted-foreground">{internship.company}</p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Personal Details */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Personal Details</h3>
                  <Edit className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Personal</p>
                    <p className="font-medium">Male, Single/ Unmarried</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Graduated</p>
                    <p className="font-medium">No</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date Of Birth</p>
                    <p className="font-medium">19 Aug 2006</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Differently Abled</p>
                    <p className="font-medium">No</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-1">Address</p>
                  <p className="font-medium">No. 34, French Colony Street, Gandhi Nagar, Coimbatore, Tamil Nadu - 600 235</p>
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Languages</h3>
                  <Button variant="ghost" size="sm" className="text-primary">
                    Add Languages
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-4 text-sm text-muted-foreground mb-2">
                    <span>Language</span>
                    <span>Proficiency</span>
                    <span>Read</span>
                    <span>Write</span>
                    <span>Speak</span>
                  </div>
                  {languages.map((lang, index) => (
                    <div key={index} className="grid grid-cols-5 gap-4 items-center">
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
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;