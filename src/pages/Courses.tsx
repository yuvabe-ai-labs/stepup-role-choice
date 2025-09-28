// import { useState } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Skeleton } from '@/components/ui/skeleton';
// import { ChevronDown, ChevronRight, Clock, Users } from 'lucide-react';
// import Navbar from '@/components/Navbar';
// import { useCourses } from '@/hooks/useCourses';
// import type { Tables } from '@/integrations/supabase/types';

// type Course = Tables<'courses'>;

// const Courses = () => {
//   const [expandedSections, setExpandedSections] = useState({
//     units: true,
//     industry: false,
//     interest: false
//   });

//   const { courses, loading, error } = useCourses();

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
//             <h1 className="text-2xl font-bold mb-2">
//               Explore {loading ? '...' : courses.length} Courses just for you
//             </h1>
//           </div>

//           {/* Courses Grid */}
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {loading ? (
//               // Loading skeletons
//               Array.from({ length: 6 }).map((_, index) => (
//                 <Card key={index} className="overflow-hidden shadow-sm">
//                   <Skeleton className="h-32 w-full" />
//                   <CardContent className="p-4 space-y-3">
//                     <Skeleton className="h-6 w-3/4" />
//                     <div className="flex items-center justify-between">
//                       <Skeleton className="h-4 w-20" />
//                       <Skeleton className="h-4 w-24" />
//                     </div>
//                     <Skeleton className="h-4 w-16" />
//                   </CardContent>
//                 </Card>
//               ))
//             ) : error ? (
//               <div className="col-span-full text-center py-8">
//                 <p className="text-muted-foreground">Error loading courses: {error}</p>
//                 <Button 
//                   variant="outline" 
//                   onClick={() => window.location.reload()}
//                   className="mt-4"
//                 >
//                   Try Again
//                 </Button>
//               </div>
//             ) : courses.length === 0 ? (
//               <div className="col-span-full text-center py-8">
//                 <p className="text-muted-foreground">No courses available at the moment.</p>
//               </div>
//             ) : (
//               courses.map((course, index) => {
//                 const gradients = [
//                   'bg-gradient-to-br from-indigo-900 to-purple-800',
//                   'bg-gradient-to-br from-purple-700 to-pink-600',
//                   'bg-gradient-to-br from-blue-600 to-cyan-500',
//                   'bg-gradient-to-br from-blue-500 to-teal-600',
//                   'bg-gradient-to-br from-green-700 to-teal-800',
//                   'bg-gradient-to-br from-orange-600 to-red-600',
//                   'bg-gradient-to-br from-yellow-600 to-orange-600',
//                   'bg-gradient-to-br from-pink-600 to-rose-600',
//                   'bg-gradient-to-br from-slate-700 to-slate-800'
//                 ];
//                 const gradient = gradients[index % gradients.length];
                
//                 return (
//                   <Card key={course.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
//                     <div className={`h-32 ${gradient} relative flex items-center justify-center`}>
//                       <div className="text-white text-center">
//                         <div className="text-lg font-bold">{course.category || 'Course'}</div>
//                       </div>
//                     </div>
                    
//                     <CardContent className="p-4 space-y-3">
//                       <h3 className="font-semibold text-lg">{course.title}</h3>
                      
//                       <div className="flex items-center justify-between text-sm text-muted-foreground">
//                         <div className="flex items-center space-x-1">
//                           <Clock className="w-3 h-3" />
//                           <span>{course.duration}</span>
//                         </div>
//                         <div className="flex items-center space-x-1">
//                           <Users className="w-3 h-3" />
//                           <span>{course.enrolled_count} enrolled</span>
//                         </div>
//                       </div>
                      
//                       <Button variant="link" className="text-primary p-0 h-auto text-sm">
//                         Know more →
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Courses;



import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, ChevronRight, Clock, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useCourses } from '@/hooks/useCourses';
import type { Tables } from '@/integrations/supabase/types';

type Course = Tables<'courses'>;

const Courses = () => {
  const [expandedSections, setExpandedSections] = useState({
    units: true,
    industry: false,
    interest: false
  });

  const [selectedFilters, setSelectedFilters] = useState({
    units: [] as string[],
    industry: [] as string[],
    interest: [] as string[],
  });

  const { courses, loading, error } = useCourses();

  // Dynamic filters
  const filterOptions = {
    units: Array.from(new Set(courses.map(c => c.provider).filter(Boolean))),
    industry: Array.from(new Set(courses.map(c => c.category).filter(Boolean))),
    interest: Array.from(new Set(courses.map(c => c.difficulty_level).filter(Boolean)))
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Toggle filter selection
  const toggleFilter = (section: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => {
      const isSelected = prev[section].includes(value);
      return {
        ...prev,
        [section]: isSelected
          ? prev[section].filter(v => v !== value)
          : [...prev[section], value]
      };
    });
  };

  // Apply filtering
  const filteredCourses = courses.filter(course => {
    const matchUnit =
      selectedFilters.units.length === 0 ||
      (course.provider && selectedFilters.units.includes(course.provider));

    const matchIndustry =
      selectedFilters.industry.length === 0 ||
      (course.category && selectedFilters.industry.includes(course.category));

    const matchInterest =
      selectedFilters.interest.length === 0 ||
      (course.difficulty_level && selectedFilters.interest.includes(course.difficulty_level));

    return matchUnit && matchIndustry && matchInterest;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-background border-r border-border p-6 min-h-screen">
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
                  {filterOptions.units.map(option => (
                    <Badge
                      key={option}
                      variant={selectedFilters.units.includes(option) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => toggleFilter('units', option)}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Industry Filter */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('industry')}
              className="flex items-center justify-between w-full text-left font-medium mb-3"
            >
              <span>Industry</span>
              {expandedSections.industry ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {expandedSections.industry && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {filterOptions.industry.map(option => (
                    <Badge
                      key={option}
                      variant={selectedFilters.industry.includes(option) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => toggleFilter('industry', option)}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interest Filter */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('interest')}
              className="flex items-center justify-between w-full text-left font-medium mb-3"
            >
              <span>Interest</span>
              {expandedSections.interest ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {expandedSections.interest && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {filterOptions.interest.map(option => (
                    <Badge
                      key={option}
                      variant={selectedFilters.interest.includes(option) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => toggleFilter('interest', option)}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button 
            className="w-full"
            onClick={() => setSelectedFilters({ units: [], industry: [], interest: [] })}
          >
            Clear Filters
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">
              Explore {loading ? '...' : filteredCourses.length} Courses just for you
            </h1>
          </div>

          {/* Courses Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden shadow-sm">
                  <Skeleton className="h-32 w-full" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </CardContent>
                </Card>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">Error loading courses: {error}</p>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No courses available at the moment.</p>
              </div>
            ) : (
              filteredCourses.map((course, index) => {
                const gradients = [
                  'bg-gradient-to-br from-indigo-900 to-purple-800',
                  'bg-gradient-to-br from-purple-700 to-pink-600',
                  'bg-gradient-to-br from-blue-600 to-cyan-500',
                  'bg-gradient-to-br from-blue-500 to-teal-600',
                  'bg-gradient-to-br from-green-700 to-teal-800',
                  'bg-gradient-to-br from-orange-600 to-red-600',
                  'bg-gradient-to-br from-yellow-600 to-orange-600',
                  'bg-gradient-to-br from-pink-600 to-rose-600',
                  'bg-gradient-to-br from-slate-700 to-slate-800'
                ];
                const gradient = gradients[index % gradients.length];
                
                return (
                  <Card key={course.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className={`h-32 ${gradient} relative flex items-center justify-center`}>
                      <div className="text-white text-center">
                        <div className="text-lg font-bold">{course.category || 'Course'}</div>
                      </div>
                    </div>
                    
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{course.enrolled_count} enrolled</span>
                        </div>
                      </div>
                      
                      <Button variant="link" className="text-primary p-0 h-auto text-sm">
                        Know more →
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
