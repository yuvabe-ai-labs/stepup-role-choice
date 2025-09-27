import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Clock, DollarSign, Bookmark, Share, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useInternships } from '@/hooks/useInternships';
import type { Tables } from '@/integrations/supabase/types';

type Internship = Tables<'internships'>;

// Helper to safely parse JSON
function safeParse<T>(data: any, fallback: T): T {
  if (!data) return fallback;
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch {
    return fallback;
  }
}

const Internships = () => {
  const { internships = [], loading, error } = useInternships();
  const [selectedInternship, setSelectedInternship] = useState<string>('');

  // Set default selected internship when data loads
  useEffect(() => {
    if (internships.length > 0 && !selectedInternship) {
      setSelectedInternship(internships[0].id);
    }
  }, [internships, selectedInternship]);

  const selectedInternshipData =
    internships.find((int) => int.id === selectedInternship) || internships[0];

  // Parse data safely with proper fallbacks
  const keyResponsibilities = safeParse<string[]>(
    selectedInternshipData?.responsibilities,
    [
      'Assist in designing user interfaces for web and mobile applications',
      'Conduct user research and usability testing',
      'Create wireframes, prototypes, and design mockups',
      'Collaborate with developers to implement designs',
      'Participate in design reviews and team meetings',
      'Help maintain design systems and style guides'
    ]
  );

  const requirements = safeParse<string[]>(
    selectedInternshipData?.requirements,
    [
      'Currently pursuing or recently completed degree in Design, HCI, or related field',
      'Proficiency in design tools like Figma, Sketch, or Adobe XD',
      'Basic understanding of HTML/CSS',
      'Strong portfolio showcasing UI/UX design skills',
      'Excellent communication and collaboration skills',
      'Passion for sustainable design and conscious living'
    ]
  );

  const skillsRequired = safeParse<string[]>(
    selectedInternshipData?.skills_required,
    ['Figma', 'Framer', 'User Interface Design', 'User Experience Design', 'Adobe Creative Suite']
  );

  const benefits = safeParse<string[]>(
    selectedInternshipData?.benefits,
    [
      'Hands-on experience with real client projects',
      'Mentorship from experienced designers',
      'Flexible working hours',
      'Access to Auroville community activities',
      'Certificate of completion',
      'Potential for full-time offer'
    ]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen">
          {/* Top Picks Header */}
          <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white p-5 m-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Top picks for you</h2>
            <p className="text-sm opacity-90 leading-relaxed">
              Based on your profile, preferences, and activity like applies, searches, and saves
            </p>
            <p className="text-xs mt-2 opacity-80">
              {loading ? '...' : internships.length} results
            </p>
          </div>

          {/* Internship Cards List */}
          <div className="px-4 pb-4 space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="cursor-pointer shadow-sm border border-gray-100">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="w-16 h-5 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-full mb-1" />
                    <Skeleton className="h-3 w-2/3 mb-3" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : error ? (
              <div className="p-4 text-center">
                <p className="text-gray-500 text-sm">
                  Error loading internships: {error}
                </p>
              </div>
            ) : internships.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-gray-500 text-sm">No internships available.</p>
              </div>
            ) : (
              internships.map((internship) => (
                <Card
                  key={internship.id}
                  className={`cursor-pointer transition-all duration-150 shadow-sm border border-gray-100 hover:shadow-md ${
                    selectedInternship === internship.id 
                      ? 'ring-2 ring-blue-500 shadow-md border-blue-200' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedInternship(internship.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {internship.company_name.charAt(0)}
                      </div>
                      <Badge className="bg-blue-500 hover:bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        Applied
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 leading-tight">
                      {internship.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed line-clamp-2">
                      {internship.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {internship.duration || 'Full Time'}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {loading ? (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start space-x-4 mb-8">
                <Skeleton className="w-16 h-16 rounded-xl" />
                <div className="flex-1">
                  <Skeleton className="h-8 w-2/3 mb-2" />
                  <Skeleton className="h-6 w-1/3 mb-4" />
                  <div className="flex space-x-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-32 w-full mb-8" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : error ? (
            <div className="max-w-4xl mx-auto text-center py-16">
              <p className="text-gray-500">Error loading internship details: {error}</p>
            </div>
          ) : !selectedInternshipData ? (
            <div className="max-w-4xl mx-auto text-center py-16">
              <p className="text-gray-500">Select an internship to view details</p>
            </div>
          ) : (
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedInternshipData.title}
                    </h1>
                    <p className="text-lg text-gray-700 mb-4">{selectedInternshipData.company_name}</p>
                    
                    <div className="flex items-center space-x-6 text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{selectedInternshipData.location || 'Auroville, Tamil Nadu'}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{selectedInternshipData.duration || '6 Months - Full Time'}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                          {selectedInternshipData.is_paid ? 
                            (selectedInternshipData.payment || 'Paid') : 
                            'Not Disclosed'
                          }
                        </span>
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
                    Applied
                  </Button>
                </div>
              </div>

              {/* About the Internship */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">About the Internship</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    {selectedInternshipData.description || 
                    'We are looking for a creative and passionate UI/UX Design Intern to join our team at Auroville Design Studio. This is an excellent opportunity to work on real-world projects while contributing to Auroville\'s sustainable community initiatives.'}
                  </p>
                  <p>
                    As an intern, you'll work closely with our design team to create user-centered digital experiences that align with Auroville's values of conscious living and environmental sustainability.
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
                      <p className="text-gray-600">{responsibility}</p>
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
                      <p className="text-gray-600">{requirement}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* What You Will Get */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">What You Will Get</h2>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <p className="text-gray-600">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Skills */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skillsRequired.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="px-3 py-1 text-sm border-gray-300 text-gray-700 hover:border-gray-400"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Company Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-teal-600 text-white rounded-xl flex items-center justify-center text-2xl font-bold">
                      <div className="w-8 h-8 bg-white text-teal-600 rounded flex items-center justify-center text-sm">
                        📄
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{selectedInternshipData.company_name}</h3>
                      {selectedInternshipData.company_email && (
                        <p className="text-sm text-gray-600">{selectedInternshipData.company_email}</p>
                      )}
                      <div className="flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedInternshipData.location || 'Auroville, Tamil Nadu'}</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-orange-600 border-orange-600 hover:bg-orange-50"
                  >
                    View Company Profile
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Internships;