import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, Bookmark, Share, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface InternshipListing {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  description: string;
  duration: string;
  savedAgo: string;
  location: string;
  payment: string;
  fullTime: boolean;
}

const Internships = () => {
  const [selectedInternship, setSelectedInternship] = useState<string>('1');

  const internships: InternshipListing[] = [
    {
      id: '1',
      title: 'Junior Designer',
      company: 'Yuvabe',
      companyLogo: 'Y',
      description: 'A UI/UX designer crafts intuitive digital experiences by blending creativity with usability.',
      duration: '6 Months - Full Time',
      savedAgo: 'Saved 5d ago',
      location: 'Auroville, Tamil Nadu',
      payment: 'Paid - Not Disclosed',
      fullTime: true
    },
    {
      id: '2',
      title: 'Marketing Manager',
      company: 'Upasana',
      companyLogo: 'U',
      description: 'A Marketing Manager crafts intuitive digital experiences by blending creativity with usability.',
      duration: '4 Months - Full Time',
      savedAgo: 'Saved 5d ago',
      location: 'Auroville, Tamil Nadu',  
      payment: 'Paid - Not Disclosed',
      fullTime: true
    },
    {
      id: '3',
      title: 'Junior Designer',
      company: 'TechCorp',
      companyLogo: 'T',
      description: 'A UI/UX designer crafts intuitive digital experiences by blending creativity with usability.',
      duration: '6 Months - Full Time',
      savedAgo: 'Saved 5d ago',
      location: 'Auroville, Tamil Nadu',
      payment: 'Paid - Not Disclosed',
      fullTime: true
    },
    {
      id: '4',
      title: 'Education - Trainer',
      company: 'EduTech',
      companyLogo: 'E',
      description: 'A Education Trainer crafts intuitive digital experiences by blending creativity with usability.',
      duration: '6 Months - Full Time',
      savedAgo: 'Saved 5d ago',
      location: 'Auroville, Tamil Nadu',
      payment: 'Paid - Not Disclosed',
      fullTime: true
    }
  ];

  const selectedInternshipData = internships.find(int => int.id === selectedInternship) || internships[0];

  const keyResponsibilities = [
    'Assist in designing user interfaces for web and mobile applications',
    'Conduct user research and usability testing',
    'Create wireframes, prototypes, and design mockups',
    'Collaborate with developers to implement designs',
    'Participate in design reviews and team meetings',
    'Help maintain design systems and style guides'
  ];

  const requirements = [
    'Currently pursuing or recently completed degree in Design, HCI, or related field',
    'Proficiency in design tools like Figma, Sketch, or Adobe XD',
    'Basic understanding of HTML/CSS'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-background border-r border-border min-h-screen">
          {/* Top Picks Header */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-6 m-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Top picks for you</h2>
            <p className="text-sm opacity-90">
              Based on your profile, preferences, and activity like applies, searches, and saves
            </p>
            <p className="text-xs mt-2 opacity-75">638 results</p>
          </div>

          {/* Internship Cards List */}
          <div className="px-4 space-y-3">
            {internships.map((internship) => (
              <Card 
                key={internship.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedInternship === internship.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedInternship(internship.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center text-sm font-bold">
                      {internship.companyLogo}
                    </div>
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                      {internship.savedAgo}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{internship.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {internship.description}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {internship.duration}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-xl flex items-center justify-center text-2xl font-bold">
                  <div className="w-8 h-8 bg-white text-teal-600 rounded flex items-center justify-center text-sm">
                    📄
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {selectedInternshipData.title}
                  </h1>
                  <p className="text-lg text-muted-foreground mb-4">{selectedInternshipData.company}</p>
                  
                  <div className="flex items-center space-x-6 text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{selectedInternshipData.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">{selectedInternshipData.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span className="text-sm">{selectedInternshipData.payment}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Bookmark className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Share className="w-4 h-4 mr-1" />
                  Share
                </Button>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  Apply Now
                </Button>
              </div>
            </div>

            {/* About the Internship */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">About the Internship</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We are looking for a creative and passionate UI/UX Design Intern to join our team at Auroville Design Studio. 
                  This is an excellent opportunity to work on real-world projects while contributing to Auroville's sustainable 
                  community initiatives.
                </p>
                <p>
                  As an intern, you'll work closely with our design team to create user-centered digital experiences that align 
                  with Auroville's values of conscious living and environmental sustainability.
                </p>
              </div>
            </div>

            {/* Key Responsibilities */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Key Responsibilities</h2>
              <div className="space-y-3">
                {keyResponsibilities.map((responsibility, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <p className="text-muted-foreground">{responsibility}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Requirements from the Candidates</h2>
              <div className="space-y-3">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <p className="text-muted-foreground">{requirement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Internships;