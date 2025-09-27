// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Skeleton } from '@/components/ui/skeleton';
// import { MapPin, Clock, DollarSign, Bookmark, Share, Check } from 'lucide-react';
// import Navbar from '@/components/Navbar';
// import { useInternships } from '@/hooks/useInternships';
// import type { Tables } from '@/integrations/supabase/types';

// type Internship = Tables<'internships'>;

// const Internships = () => {
//   const { internships, loading, error } = useInternships();
//   const [selectedInternship, setSelectedInternship] = useState<string>('');

//   // Set default selected internship when data loads
//   React.useEffect(() => {
//     if (internships.length > 0 && !selectedInternship) {
//       setSelectedInternship(internships[0].id);
//     }
//   }, [internships, selectedInternship]);

//   const selectedInternshipData = internships.find(int => int.id === selectedInternship) || internships[0];

//   // // Get dynamic data or fallback to static data
//   // const keyResponsibilities = selectedInternshipData?.responsibilities 
//   //   ? (selectedInternshipData.responsibilities as string[])
//   //   : [
//   //       'Assist in designing user interfaces for web and mobile applications',
//   //       'Conduct user research and usability testing',
//   //       'Create wireframes, prototypes, and design mockups',
//   //       'Collaborate with developers to implement designs',
//   //       'Participate in design reviews and team meetings',
//   //       'Help maintain design systems and style guides'
//   //     ];

//   // const requirements = selectedInternshipData?.requirements 
//   //   ? (selectedInternshipData.requirements as string[])
//   //   : [
//   //       'Currently pursuing or recently completed degree in Design, HCI, or related field',
//   //       'Proficiency in design tools like Figma, Sketch, or Adobe XD',
//   //       'Basic understanding of HTML/CSS'
//   //     ];

//   const keyResponsibilities = selectedInternshipData?.responsibilities ?? [];
//   const requirements = selectedInternshipData?.requirements ?? [];


//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
      
//       <div className="flex">
//         {/* Left Sidebar */}
//         <div className="w-80 bg-background border-r border-border min-h-screen">
//           {/* Top Picks Header */}
//           <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-6 m-4 rounded-lg">
//             <h2 className="text-lg font-semibold mb-2">Top picks for you</h2>
//             <p className="text-sm opacity-90">
//               Based on your profile, preferences, and activity like applies, searches, and saves
//             </p>
//             <p className="text-xs mt-2 opacity-75">{loading ? '...' : internships.length} results</p>
//           </div>

//           {/* Internship Cards List */}
//           <div className="px-4 space-y-3">
//             {loading ? (
//               // Loading skeletons
//               Array.from({ length: 3 }).map((_, index) => (
//                 <Card key={index} className="cursor-pointer">
//                   <CardContent className="p-4">
//                     <div className="flex justify-between items-start mb-2">
//                       <Skeleton className="w-8 h-8 rounded-full" />
//                       <Skeleton className="w-16 h-4" />
//                     </div>
//                     <Skeleton className="h-4 w-3/4 mb-1" />
//                     <Skeleton className="h-3 w-full mb-3" />
//                     <Skeleton className="h-3 w-2/3" />
//                   </CardContent>
//                 </Card>
//               ))
//             ) : error ? (
//               <div className="p-4 text-center">
//                 <p className="text-muted-foreground text-sm">Error loading internships: {error}</p>
//               </div>
//             ) : internships.length === 0 ? (
//               <div className="p-4 text-center">
//                 <p className="text-muted-foreground text-sm">No internships available.</p>
//               </div>
//             ) : (
//               internships.map((internship) => (
//                 <Card 
//                   key={internship.id} 
//                   className={`cursor-pointer transition-all hover:shadow-md ${
//                     selectedInternship === internship.id ? 'ring-2 ring-primary' : ''
//                   }`}
//                   onClick={() => setSelectedInternship(internship.id)}
//                 >
//                   <CardContent className="p-4">
//                     <div className="flex justify-between items-start mb-2">
//                       <div className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center text-sm font-bold">
//                         {internship.company_name.charAt(0)}
//                       </div>
//                       <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
//                         Active
//                       </Badge>
//                     </div>
//                     <h3 className="font-semibold text-sm mb-1">{internship.title}</h3>
//                     <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
//                       {internship.description}
//                     </p>
//                     <div className="flex items-center text-xs text-muted-foreground">
//                       <Clock className="w-3 h-3 mr-1" />
//                       {internship.duration}
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 p-8">
//           {loading ? (
//             <div className="max-w-4xl mx-auto">
//               <div className="flex items-start space-x-4 mb-8">
//                 <Skeleton className="w-16 h-16 rounded-xl" />
//                 <div className="flex-1">
//                   <Skeleton className="h-8 w-2/3 mb-2" />
//                   <Skeleton className="h-6 w-1/3 mb-4" />
//                   <div className="flex space-x-6">
//                     <Skeleton className="h-4 w-24" />
//                     <Skeleton className="h-4 w-24" />
//                     <Skeleton className="h-4 w-24" />
//                   </div>
//                 </div>
//               </div>
//               <Skeleton className="h-32 w-full mb-8" />
//               <Skeleton className="h-48 w-full" />
//             </div>
//           ) : error ? (
//             <div className="max-w-4xl mx-auto text-center py-16">
//               <p className="text-muted-foreground">Error loading internship details: {error}</p>
//             </div>
//           ) : !selectedInternshipData ? (
//             <div className="max-w-4xl mx-auto text-center py-16">
//               <p className="text-muted-foreground">Select an internship to view details</p>
//             </div>
//           ) : (
//             <div className="max-w-4xl mx-auto">
//               {/* Header */}
//               <div className="flex items-start justify-between mb-8">
//                 <div className="flex items-start space-x-4">
//                   <div className="w-16 h-16 bg-teal-600 text-white rounded-xl flex items-center justify-center text-2xl font-bold">
//                     <div className="w-8 h-8 bg-white text-teal-600 rounded flex items-center justify-center text-sm">
//                       📄
//                     </div>
//                   </div>
//                   <div>
//                     <h1 className="text-3xl font-bold text-foreground mb-2">
//                       {selectedInternshipData.title}
//                     </h1>
//                     <p className="text-lg text-muted-foreground mb-4">{selectedInternshipData.company_name}</p>
                    
//                     <div className="flex items-center space-x-6 text-muted-foreground">
//                       <div className="flex items-center">
//                         <MapPin className="w-4 h-4 mr-1" />
//                         <span className="text-sm">{selectedInternshipData.location}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <Clock className="w-4 h-4 mr-1" />
//                         <span className="text-sm">{selectedInternshipData.duration}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <DollarSign className="w-4 h-4 mr-1" />
//                         <span className="text-sm">{selectedInternshipData.payment}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex space-x-3">
//                   <Button variant="outline" size="sm" className="flex items-center">
//                     <Bookmark className="w-4 h-4 mr-1" />
//                     Save
//                   </Button>
//                   <Button variant="outline" size="sm" className="flex items-center">
//                     <Share className="w-4 h-4 mr-1" />
//                     Share
//                   </Button>
//                   <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
//                     Apply Now
//                   </Button>
//                 </div>
//               </div>

//               {/* About the Internship */}
//               <div className="mb-8">
//                 <h2 className="text-xl font-semibold mb-4">About the Internship</h2>
//                 <div className="space-y-4 text-muted-foreground">
//                   <p>{selectedInternshipData.description}</p>
//                 </div>
//               </div>

//               {/* Key Responsibilities */}
//               <div className="mb-8">
//                 <h2 className="text-xl font-semibold mb-4">Key Responsibilities</h2>
//                 <div className="space-y-3">
//                   {keyResponsibilities.map((responsibility, index) => (
//                     <div key={index} className="flex items-start space-x-3">
//                       <div className="w-5 h-5 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                         <Check className="w-3 h-3" />
//                       </div>
//                       <p className="text-muted-foreground">{responsibility}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Requirements */}
//               <div className="mb-8">
//                 <h2 className="text-xl font-semibold mb-4">Requirements from the Candidates</h2>
//                 <div className="space-y-3">
//                   {requirements.map((requirement, index) => (
//                     <div key={index} className="flex items-start space-x-3">
//                       <div className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                         <Check className="w-3 h-3" />
//                       </div>
//                       <p className="text-muted-foreground">{requirement}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Internships;

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

  // Parse responsibilities and requirements safely
  const rawResponsibilities = safeParse<any>(
    selectedInternshipData?.responsibilities,
    []
  );
  const keyResponsibilities = Array.isArray(rawResponsibilities)
    ? rawResponsibilities
    : rawResponsibilities?.responsibility
    ? [rawResponsibilities.responsibility]
    : [
        'Assist in designing user interfaces for web and mobile applications',
        'Conduct user research and usability testing',
        'Create wireframes, prototypes, and design mockups',
      ];

  const rawRequirements = safeParse<any>(
    selectedInternshipData?.requirements,
    []
  );
  const requirements = Array.isArray(rawRequirements)
    ? rawRequirements
    : typeof rawRequirements === 'string'
    ? [rawRequirements]
    : [
        'Currently pursuing or recently completed degree in Design, HCI, or related field',
        'Proficiency in design tools like Figma, Sketch, or Adobe XD',
      ];

  const skillsRequired = safeParse<Record<string, string[]>>(
    selectedInternshipData?.skills_required,
    {}
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen">
          {/* Top Picks Header */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-6 m-4 rounded-xl">
            <h2 className="text-xl font-bold mb-2">Top picks for you</h2>
            <p className="text-sm opacity-90 leading-relaxed">
              Based on your profile, preferences, and activity like applies, searches, and saves
            </p>
            <p className="text-xs mt-3 opacity-80">
              {loading ? '...' : internships.length} results
            </p>
          </div>

          {/* Internship Cards List */}
          <div className="px-4 pb-4 space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="cursor-pointer shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <Skeleton className="w-20 h-5 rounded-full" />
                    </div>
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-4 w-1/2" />
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
                  className={`cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
                    selectedInternship === internship.id 
                      ? 'ring-2 ring-blue-500 shadow-md' 
                      : 'hover:ring-1 hover:ring-gray-300'
                  }`}
                  onClick={() => setSelectedInternship(internship.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {internship.company_name.charAt(0)}
                      </div>
                      <Badge className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Posted just now
                      </Badge>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-2 leading-tight">
                      {internship.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">
                      {internship.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      {internship.duration}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white">
          {loading ? (
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-start space-x-6">
                  <Skeleton className="w-16 h-16 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-80" />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center py-16">
              <p className="text-gray-500">
                Error loading internship details: {error}
              </p>
            </div>
          ) : !selectedInternshipData ? (
            <div className="p-8 text-center py-16">
              <p className="text-gray-500">Select an internship to view details</p>
            </div>
          ) : (
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-teal-600 text-white rounded-xl flex items-center justify-center text-2xl font-bold">
                    {selectedInternshipData.company_name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedInternshipData.title}
                    </h1>
                    <p className="text-lg text-gray-600 mb-3">
                      {selectedInternshipData.company_name}
                    </p>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        Auroville, Tamil Nadu
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {selectedInternshipData.duration}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Paid - Not Disclosed
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Bookmark className="w-4 h-4" />
                    <span>Save</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Share className="w-4 h-4" />
                    <span>Share</span>
                  </Button>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6">
                    Apply Now
                  </Button>
                </div>
              </div>

              {/* About the Internship */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Internship</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed text-base">
                    {selectedInternshipData.description}
                  </p>
                  {selectedInternshipData.company_name === 'Yuvabe' && (
                    <>
                      <p className="text-gray-700 leading-relaxed text-base mt-4">
                        We are looking for a creative and passionate UI/UX Design Intern to join our team at Auroville Design Studio. 
                        This is an excellent opportunity to work on real-world projects while contributing to Auroville's sustainable 
                        community initiatives.
                      </p>
                      <p className="text-gray-700 leading-relaxed text-base mt-4">
                        As an intern, you'll work closely with our design team to create user-centered digital experiences that align 
                        with Auroville's values of conscious living and environmental sustainability.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Key Responsibilities */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Responsibilities</h2>
                <div className="space-y-4">
                  {keyResponsibilities.map((responsibility, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-4 h-4" />
                      </div>
                      <p className="text-gray-700 text-base leading-relaxed">{responsibility}</p>
                    </div>
                  ))}
                  {selectedInternshipData.company_name === 'Yuvabe' && keyResponsibilities.length <= 3 && (
                    <>
                      <div className="flex items-start space-x-4">
                        <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Check className="w-4 h-4" />
                        </div>
                        <p className="text-gray-700 text-base leading-relaxed">
                          Collaborate with developers to implement designs
                        </p>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Check className="w-4 h-4" />
                        </div>
                        <p className="text-gray-700 text-base leading-relaxed">
                          Participate in design reviews and team meetings
                        </p>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Check className="w-4 h-4" />
                        </div>
                        <p className="text-gray-700 text-base leading-relaxed">
                          Help maintain design systems and style guides
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements from the Candidates</h2>
                <div className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-4 h-4" />
                      </div>
                      <p className="text-gray-700 text-base leading-relaxed">{requirement}</p>
                    </div>
                  ))}
                  {selectedInternshipData.company_name === 'Yuvabe' && requirements.length <= 2 && (
                    <div className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-4 h-4" />
                      </div>
                      <p className="text-gray-700 text-base leading-relaxed">
                        Basic understanding of HTML/CSS
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills Required */}
              {Object.keys(skillsRequired).length > 0 && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills Required</h2>
                  <div className="space-y-6">
                    {Object.entries(skillsRequired).map(([category, skills]) => (
                      <div key={category}>
                        <h3 className="font-semibold text-lg text-gray-800 mb-3">{category}</h3>
                        <ul className="space-y-2 ml-4">
                          {skills.map((skill, i) => (
                            <li key={i} className="text-gray-700 text-base leading-relaxed flex items-start">
                              <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Company Profile */}
                <div className="mb-8 bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-teal-600 text-white rounded-2xl flex items-center justify-center shadow-sm">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {selectedInternshipData.company_name?.replace(/\n/g, '')}
                        </h3>
                        {selectedInternshipData.company_email && (
                          <p className="text-gray-600 mb-2">{selectedInternshipData.company_email}</p>
                        )}
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {selectedInternshipData.location}
                        </div>
                      </div>
                    </div>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md">
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