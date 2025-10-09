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
import { useApplicationStatus } from '@/hooks/useApplicationStatus';
import ProfileSummaryDialog from '@/components/ProfileSummaryDialog';
import ApplicationSuccessDialog from '@/components/ApplicationSuccessDialog';
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

// Helper to convert numbered object to array
function parseNumberedObject(data: any): string[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object') {
    return Object.entries(data)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([_, value]) => value as string)
      .filter(value => typeof value === 'string' && value.length > 0 && !value.toLowerCase().includes('responsibilities') && !value.toLowerCase().includes('requirements') && !value.toLowerCase().includes('candidates'));
  }
  return [];
}

const Internships = () => {
  const { internships: rawInternships = [], loading, error } = useInternships();
  const [selectedInternship, setSelectedInternship] = useState<string>('');
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const { hasApplied, isLoading: applicationLoading, markAsApplied } = useApplicationStatus(selectedInternship);

  // Ensure internships is always an array
  const internships = Array.isArray(rawInternships) ? rawInternships : rawInternships ? [rawInternships] : [];

  // Set default selected internship when data loads
  useEffect(() => {
    if (internships.length > 0 && !selectedInternship) {
      setSelectedInternship(internships[0].id);
    }
  }, [internships, selectedInternship]);

  const selectedInternshipData =
    internships.find((int) => int.id === selectedInternship) || internships[0];

  // Parse all data fields from database with error handling
  let responsibilities = [];
  let requirements = [];
  let skills = [];
  let benefits = [];
  
  try {
    responsibilities = parseNumberedObject(safeParse(selectedInternshipData?.responsibilities, {}));
  } catch (e) {
    console.error('Error parsing responsibilities:', e);
    responsibilities = [];
  }
  
  try {
    requirements = parseNumberedObject(safeParse(selectedInternshipData?.requirements, {}));
  } catch (e) {
    console.error('Error parsing requirements:', e);
    requirements = [];
  }
  
  try {
    skills = parseNumberedObject(safeParse(selectedInternshipData?.skills_required, {}));
  } catch (e) {
    console.error('Error parsing skills:', e);
    skills = [];
  }
  
  try {
    benefits = parseNumberedObject(safeParse(selectedInternshipData?.benefits, {}));
  } catch (e) {
    console.error('Error parsing benefits:', e);
    benefits = [];
  }

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
                        {internship.company_name?.charAt(0) || 'C'}
                      </div>
                      <Badge className="bg-blue-500 hover:bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        Saved 5d ago
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
                <div className="flex items-start space-x-5">
                  <Skeleton className="w-16 h-16 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-64" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-80" />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Skeleton className="h-9 w-16" />
                  <Skeleton className="h-9 w-16" />
                  <Skeleton className="h-9 w-24" />
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
                <div className="flex items-start space-x-5">
                  <div className="w-16 h-16 bg-teal-600 text-white rounded-2xl flex items-center justify-center shadow-sm">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                      {selectedInternshipData.title}
                    </h1>
                    <p className="text-lg text-gray-700 mb-3 font-medium">
                      {selectedInternshipData.company_name?.replace(/\n/g, '')}
                    </p>
                    <div className="flex items-center space-x-5 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 text-gray-500" />
                        {selectedInternshipData.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1.5 text-gray-500" />
                        {selectedInternshipData.duration}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1.5 text-gray-500" />
                        {selectedInternshipData.payment}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm" className="flex items-center space-x-1.5 px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Bookmark className="w-4 h-4" />
                    <span>Save</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1.5 px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Share className="w-4 h-4" />
                    <span>Share</span>
                  </Button>
                  <Button 
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium"
                    onClick={() => setShowApplicationDialog(true)}
                    disabled={applicationLoading}
                  >
                    {hasApplied ? 'Applied' : 'Apply Now'}
                  </Button>
                </div>
              </div>

              {/* About the Internship */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Internship</h2>
                <div className="text-gray-700 leading-relaxed">
                  <p>{selectedInternshipData.description}</p>
                </div>
              </div>

              {/* Key Responsibilities */}
              {responsibilities.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Responsibilities</h2>
                  <div className="space-y-3">
                    {responsibilities.map((responsibility, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <p className="text-gray-700 leading-relaxed">{responsibility}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {requirements.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements from the Candidates</h2>
                  <div className="space-y-3">
                    {requirements.map((requirement, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <p className="text-gray-700 leading-relaxed">{requirement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Required */}
              {skills.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills Required</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {benefits.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <p className="text-gray-700 leading-relaxed">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {selectedInternshipData.application_deadline && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Deadline</h3>
                    <p className="text-gray-700">
                      {new Date(selectedInternshipData.application_deadline).toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                {selectedInternshipData.company_email && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact</h3>
                    <p className="text-gray-700">{selectedInternshipData.company_email}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Dialog */}
      {selectedInternshipData && (
        <ProfileSummaryDialog
          isOpen={showApplicationDialog}
          onClose={() => setShowApplicationDialog(false)}
          internship={selectedInternshipData}
          onSuccess={() => {
            markAsApplied();
            setShowSuccessDialog(true);
          }}
        />
      )}

      {/* Success Dialog */}
      <ApplicationSuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
      />
    </div>
  );
};

export default Internships;