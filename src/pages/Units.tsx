// import { useState } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { ChevronDown, ChevronRight } from 'lucide-react';
// import Navbar from '@/components/Navbar';

// interface Internship {
//   id: string;
//   title: string;
//   company: string;
//   companyLogo: string;
//   duration: string;
//   backgroundImage: string;
//   gradient: string;
// }

// const Units = () => {
//   const [expandedSections, setExpandedSections] = useState({
//     units: true,
//     industry: false,
//     interest: false
//   });

//   const internships: Internship[] = [
//     {
//       id: '1',
//       title: 'Senior UI Developer',
//       company: 'Yuvabe',
//       companyLogo: 'Y',
//       duration: '1st agos',
//       backgroundImage: 'bg-gradient-to-br from-gray-900 to-purple-900',
//       gradient: 'bg-gradient-to-br from-gray-900 to-purple-900'
//     },
//     {
//       id: '2',
//       title: 'WordPress Developer',
//       company: 'Upasana',
//       companyLogo: 'U',
//       duration: '3rd agos',
//       backgroundImage: 'bg-gradient-to-br from-teal-600 to-blue-700',
//       gradient: 'bg-gradient-to-br from-teal-600 to-blue-700'
//     },
//     {
//       id: '3',
//       title: 'Jr. Marketing Manager',
//       company: 'Yuvabe',
//       companyLogo: 'Y',
//       duration: '5d agos',
//       backgroundImage: 'bg-gradient-to-br from-gray-800 to-orange-900',
//       gradient: 'bg-gradient-to-br from-gray-800 to-orange-900'
//     },
//     {
//       id: '4',
//       title: 'Marketing Intern',
//       company: 'Upasana',
//       companyLogo: 'U',
//       duration: '10d agos',
//       backgroundImage: 'bg-gradient-to-br from-blue-600 to-teal-700',
//       gradient: 'bg-gradient-to-br from-blue-600 to-teal-700'
//     },
//     {
//       id: '5',
//       title: 'Barista Intern',
//       company: "Marc's Cafe",
//       companyLogo: 'M',
//       duration: '2d agos',
//       backgroundImage: 'bg-gradient-to-br from-gray-700 to-gray-900',
//       gradient: 'bg-gradient-to-br from-gray-700 to-gray-900'
//     },
//     {
//       id: '6',
//       title: 'Tailoring Intern',
//       company: 'Upasana',
//       companyLogo: 'U',
//       duration: '6d agos',
//       backgroundImage: 'bg-gradient-to-br from-teal-700 to-blue-800',
//       gradient: 'bg-gradient-to-br from-teal-700 to-blue-800'
//     },
//     {
//       id: '7',
//       title: 'Junior UI Designer',
//       company: 'Yuvabe',
//       companyLogo: 'Y',
//       duration: '5d agos',
//       backgroundImage: 'bg-gradient-to-br from-gray-900 to-purple-900',
//       gradient: 'bg-gradient-to-br from-gray-900 to-purple-900'
//     },
//     {
//       id: '8',
//       title: 'WordPress Developer',
//       company: 'Upasana',
//       companyLogo: 'U',
//       duration: '3rd agos',
//       backgroundImage: 'bg-gradient-to-br from-teal-600 to-blue-700',
//       gradient: 'bg-gradient-to-br from-teal-600 to-blue-700'
//     },
//     {
//       id: '9',
//       title: 'Sr. Marketing Manager',
//       company: 'Yuvabe',
//       companyLogo: 'Y',
//       duration: '5d agos',
//       backgroundImage: 'bg-gradient-to-br from-gray-800 to-orange-900',
//       gradient: 'bg-gradient-to-br from-gray-800 to-orange-900'
//     }
//   ];

//   const filterOptions = {
//     units: ['Yuvabe', 'Upasana', "Marc's cafe", 'Egial', 'Youth center', 'Auronico'],
//     industry: ['Yuvabe', 'Upasana', "Marc's cafe", 'Egial', 'Youth center', 'Auronico'],
//     interest: ['Yuvabe', 'Upasana', "Marc's cafe", 'Egial', 'Youth center', 'Auronico']
//   };

//   const toggleSection = (section: keyof typeof expandedSections) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
      
//       <div className="flex">
//         {/* Sidebar */}
//         <div className="w-80 bg-background border-r border-border p-6 min-h-screen">
//           <h2 className="text-lg font-semibold mb-6">All Filters</h2>
          
//           {/* Units Filter */}
//           <div className="mb-6">
//             <button
//               onClick={() => toggleSection('units')}
//               className="flex items-center justify-between w-full text-left font-medium mb-3"
//             >
//               <span>Units</span>
//               {expandedSections.units ? (
//                 <ChevronDown className="w-4 h-4" />
//               ) : (
//                 <ChevronRight className="w-4 h-4" />
//               )}
//             </button>
//             {expandedSections.units && (
//               <div className="space-y-2">
//                 <div className="flex flex-wrap gap-2">
//                   {filterOptions.units.map(option => (
//                     <Badge
//                       key={option}
//                       variant="outline"
//                       className="cursor-pointer hover:bg-accent"
//                     >
//                       {option}
//                     </Badge>
//                   ))}
//                 </div>
//                 <button className="text-sm text-primary">+ Show More</button>
//               </div>
//             )}
//           </div>

//           {/* Industry Filter */}
//           <div className="mb-6">
//             <button
//               onClick={() => toggleSection('industry')}
//               className="flex items-center justify-between w-full text-left font-medium mb-3"
//             >
//               <span>Industry</span>
//               {expandedSections.industry ? (
//                 <ChevronDown className="w-4 h-4" />
//               ) : (
//                 <ChevronRight className="w-4 h-4" />
//               )}
//             </button>
//             {expandedSections.industry && (
//               <div className="space-y-2">
//                 <div className="flex flex-wrap gap-2">
//                   {filterOptions.industry.map(option => (
//                     <Badge
//                       key={option}
//                       variant="outline"
//                       className="cursor-pointer hover:bg-accent"
//                     >
//                       {option}
//                     </Badge>
//                   ))}
//                 </div>
//                 <button className="text-sm text-primary">+ Show More</button>
//               </div>
//             )}
//           </div>

//           {/* Interest Filter */}
//           <div className="mb-6">
//             <button
//               onClick={() => toggleSection('interest')}
//               className="flex items-center justify-between w-full text-left font-medium mb-3"
//             >
//               <span>Interest</span>
//               {expandedSections.interest ? (
//                 <ChevronDown className="w-4 h-4" />
//               ) : (
//                 <ChevronRight className="w-4 h-4" />
//               )}
//             </button>
//             {expandedSections.interest && (
//               <div className="space-y-2">
//                 <div className="flex flex-wrap gap-2">
//                   {filterOptions.interest.map(option => (
//                     <Badge
//                       key={option}
//                       variant="outline"
//                       className="cursor-pointer hover:bg-accent"
//                     >
//                       {option}
//                     </Badge>
//                   ))}
//                 </div>
//                 <button className="text-sm text-primary">+ Show More</button>
//               </div>
//             )}
//           </div>

//           <Button className="w-full">Apply</Button>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 p-6">
//           <div className="mb-8">
//             <h1 className="text-2xl font-bold mb-2">Explore 16 Units just for you</h1>
//           </div>

//           {/* Internships Grid */}
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {internships.map((internship) => (
//               <Card key={internship.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
//                 <div className={`h-48 ${internship.gradient} relative flex items-center justify-center`}>
//                   <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800 text-xs">
//                     {internship.duration}
//                   </Badge>
//                   <div className="text-white">
//                     <h3 className="text-xl font-bold text-center">{internship.title}</h3>
//                   </div>
//                   <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white w-6 h-6" />
//                   <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
//                     <div className="w-2 h-2 bg-white/60 rounded-full"></div>
//                     <div className="w-2 h-2 bg-white rounded-full"></div>
//                     <div className="w-2 h-2 bg-white/60 rounded-full"></div>
//                     <div className="w-2 h-2 bg-white/60 rounded-full"></div>
//                     <div className="w-2 h-2 bg-white/60 rounded-full"></div>
//                   </div>
//                 </div>
                
//                 <CardContent className="p-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2">
//                       <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
//                         {internship.companyLogo}
//                       </div>
//                       <span className="text-sm font-medium">{internship.company}</span>
//                     </div>
//                     <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
//                       View
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Units;


import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

interface Unit {
  id: string;
  unit_name: string;
  unit_type: string;
  focus_areas: Json;
  opportunities_offered: Json;
  skills_offered: Json;
  profile_id: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  is_aurovillian: boolean;
  created_at: string;
  updated_at: string;
}


// Helper to safely parse JSON
function safeParse<T>(data: any, fallback: T): T {
  if (!data) return fallback;
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch {
    return fallback;
  }
}

// Helper to get gradient based on unit type or name
function getUnitGradient(unitName: string, unitType: string): string {
  const gradients = [
    'bg-gradient-to-br from-gray-900 to-purple-900',
    'bg-gradient-to-br from-teal-600 to-blue-700',
    'bg-gradient-to-br from-gray-800 to-orange-900',
    'bg-gradient-to-br from-blue-600 to-teal-700',
    'bg-gradient-to-br from-gray-700 to-gray-900',
    'bg-gradient-to-br from-teal-700 to-blue-800',
    'bg-gradient-to-br from-purple-600 to-indigo-700',
    'bg-gradient-to-br from-green-600 to-teal-700',
    'bg-gradient-to-br from-red-600 to-pink-700'
  ];
  
  // Use hash of unit name to consistently assign gradient
  const hash = unitName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}

// Helper to format time ago
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInHours === 0) return 'Today';
  if (diffInHours === 1) return '1d ago';
  if (diffInHours < 7) return `${diffInHours}d ago`;
  if (diffInHours < 30) return `${Math.floor(diffInHours / 7)}w ago`;
  return `${Math.floor(diffInHours / 30)}m ago`;
}

const Units = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    units: true,
    industry: false,
    interest: false
  });

  // Fetch units from database
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('units')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching units:', error);
          setError(error.message);
        } else {
          setUnits(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to fetch units');
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  // Get unique values for filters
  const getUniqueUnitNames = () => {
    return [...new Set(units.map(unit => unit.unit_name))];
  };

  const getUniqueUnitTypes = () => {
    return [...new Set(units.map(unit => unit.unit_type))];
  };

  const getUniqueFocusAreas = () => {
    const allFocusAreas = units.flatMap(unit => {
      const focusAreas = safeParse(unit.focus_areas, {});
      return Object.keys(focusAreas);
    });
    return [...new Set(allFocusAreas)];
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 min-h-screen">
          <h2 className="text-lg font-semibold mb-6">All Filters</h2>
          
          {/* Units Filter */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('units')}
              className="flex items-center justify-between w-full text-left font-medium mb-3"
            >
              <span>Units</span>
              {expandedSections.units ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {expandedSections.units && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {getUniqueUnitNames().map(unitName => (
                    <Badge
                      key={unitName}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      {unitName}
                    </Badge>
                  ))}
                </div>
                <button className="text-sm text-blue-600">+ Show More</button>
              </div>
            )}
          </div>

          {/* Unit Type Filter */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('industry')}
              className="flex items-center justify-between w-full text-left font-medium mb-3"
            >
              <span>Unit Type</span>
              {expandedSections.industry ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {expandedSections.industry && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {getUniqueUnitTypes().map(unitType => (
                    <Badge
                      key={unitType}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      {unitType}
                    </Badge>
                  ))}
                </div>
                <button className="text-sm text-blue-600">+ Show More</button>
              </div>
            )}
          </div>

          {/* Focus Areas Filter */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('interest')}
              className="flex items-center justify-between w-full text-left font-medium mb-3"
            >
              <span>Focus Areas</span>
              {expandedSections.interest ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {expandedSections.interest && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {getUniqueFocusAreas().map(focusArea => (
                    <Badge
                      key={focusArea}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      {focusArea}
                    </Badge>
                  ))}
                </div>
                <button className="text-sm text-blue-600">+ Show More</button>
              </div>
            )}
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700">Apply</Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">
              Explore {units.length} Units just for you
            </h1>
          </div>

          {loading ? (
            /* Loading Skeleton */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden shadow-sm">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-gray-500">Error loading units: {error}</p>
            </div>
          ) : units.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No units available.</p>
            </div>
          ) : (
            /* Units Grid */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {units.map((unit) => {
                const focusAreas = safeParse(unit.focus_areas, {});
                const gradient = getUnitGradient(unit.unit_name, unit.unit_type);
                const timeAgo = getTimeAgo(unit.created_at);

                return (
                  <Card key={unit.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className={`h-48 ${gradient} relative flex items-center justify-center`}>
                      <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800 text-xs">
                        {timeAgo}
                      </Badge>
                      <div className="text-white text-center px-4">
                        <h3 className="text-xl font-bold mb-1">{unit.unit_name}</h3>
                        <p className="text-white/80 text-sm">{unit.unit_type}</p>
                        {Object.keys(focusAreas).length > 0 && (
                          <div className="mt-2">
                            {Object.entries(focusAreas as Record<string, string>).slice(0, 2).map(([key, value]) => (
                              <Badge key={key} className="bg-white/20 text-white text-xs mr-1 mb-1">
                                {key}: {value}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white w-6 h-6" />
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {unit.unit_name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{unit.unit_name}</span>
                            
                            )}
                          </div>
                        </div>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                          View
                        </Button>
                      </div>
                      {unit.address && (
                        <p className="text-xs text-gray-500 mt-2">{unit.address}</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Units;