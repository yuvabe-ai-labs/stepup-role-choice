import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Clock, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Course {
  id: string;
  title: string;
  duration: string;
  enrolled: string;
  gradient: string;
  image: string;
}

const Courses = () => {
  const [expandedSections, setExpandedSections] = useState({
    units: true,
    industry: false,
    interest: false
  });

  const courses: Course[] = [
    {
      id: '1',
      title: 'AI & Machine Learning',
      duration: '6 Months',
      enrolled: '32 Enrolled',
      gradient: 'bg-gradient-to-br from-indigo-900 to-purple-800',
      image: 'Generative AI'
    },
    {
      id: '2',
      title: 'UI/UX Design',
      duration: '3 Months',
      enrolled: '22 Enrolled',
      gradient: 'bg-gradient-to-br from-purple-700 to-pink-600',
      image: 'UX UI'
    },
    {
      id: '3',
      title: 'Full Stack Development',
      duration: '4 Months',
      enrolled: '15 Enrolled',
      gradient: 'bg-gradient-to-br from-blue-600 to-cyan-500',
      image: 'Full Stack Development'
    },
    {
      id: '4',
      title: 'Digital Marketing',
      duration: '3 Months',
      enrolled: '193 Enrolled',
      gradient: 'bg-gradient-to-br from-blue-500 to-teal-600',
      image: 'Digital Marketing'
    },
    {
      id: '5',
      title: 'Corporate Sustainability',
      duration: '6 Months',
      enrolled: '50 Enrolled',
      gradient: 'bg-gradient-to-br from-green-700 to-teal-800',
      image: 'Corporate Sustainability'
    },
    {
      id: '6',
      title: 'AI & Machine Learning',
      duration: '6 Months',
      enrolled: '32 Enrolled',
      gradient: 'bg-gradient-to-br from-indigo-900 to-purple-800',
      image: 'Generative AI'
    },
    {
      id: '7',
      title: 'UI/UX Design',
      duration: '3 Months',
      enrolled: '22 Enrolled',
      gradient: 'bg-gradient-to-br from-purple-700 to-pink-600',
      image: 'UX UI'
    },
    {
      id: '8',
      title: 'Full Stack Development',
      duration: '4 Months',
      enrolled: '15 Enrolled',
      gradient: 'bg-gradient-to-br from-blue-600 to-cyan-500',
      image: 'Full Stack Development'
    },
    {
      id: '9',
      title: 'Digital Marketing',
      duration: '3 Months',
      enrolled: '193 Enrolled',
      gradient: 'bg-gradient-to-br from-blue-500 to-teal-600',
      image: 'Digital Marketing'
    }
  ];

  const filterOptions = {
    units: ['Yuvabe', 'Upasana', "Marc's cafe", 'Egial', 'Youth center', 'Auronico'],
    industry: ['Yuvabe', 'Upasana', "Marc's cafe", 'Egial', 'Youth center', 'Auronico'],
    interest: ['Yuvabe', 'Upasana', "Marc's cafe", 'Egial', 'Youth center', 'Auronico']
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
                <button className="text-sm text-primary">+ Show More</button>
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
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
                <button className="text-sm text-primary">+ Show More</button>
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
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
                <button className="text-sm text-primary">+ Show More</button>
              </div>
            )}
          </div>

          <Button className="w-full">Apply</Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Explore 12 Courses just for you</h1>
          </div>

          {/* Courses Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className={`h-32 ${course.gradient} relative flex items-center justify-center`}>
                  <div className="text-white text-center">
                    <div className="text-lg font-bold">{course.image}</div>
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
                      <span>{course.enrolled}</span>
                    </div>
                  </div>
                  
                  <Button variant="link" className="text-primary p-0 h-auto text-sm">
                    Know more →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;