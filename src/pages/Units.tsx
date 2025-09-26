
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Unit {
  id: string;
  name: string;
  type: string;
  logo: string;
  duration: string;
  backgroundImage: string;
  gradient: string;
}

const Units = () => {
  const [expandedSections, setExpandedSections] = useState({
    units: true,
    industry: false,
    interest: false
  });

  const units: Unit[] = [
    {
      id: '1',
      name: 'Yuvabe',
      type: 'Technology Unit',
      logo: 'Y',
      duration: '1st agos',
      backgroundImage: 'bg-gradient-to-br from-gray-900 to-purple-900',
      gradient: 'bg-gradient-to-br from-gray-900 to-purple-900'
    },
    {
      id: '2',
      name: 'Upasana',
      type: 'Fashion Unit',
      logo: 'U',
      duration: '3rd agos',
      backgroundImage: 'bg-gradient-to-br from-teal-600 to-blue-700',
      gradient: 'bg-gradient-to-br from-teal-600 to-blue-700'
    },
    {
      id: '3',
      name: "Marc's Cafe",
      type: 'Food & Beverage Unit',
      logo: 'M',
      duration: '5d agos',
      backgroundImage: 'bg-gradient-to-br from-gray-800 to-orange-900',
      gradient: 'bg-gradient-to-br from-gray-800 to-orange-900'
    },
    {
      id: '4',
      name: 'Egial',
      type: 'Education Unit',
      logo: 'E',
      duration: '10d agos',
      backgroundImage: 'bg-gradient-to-br from-blue-600 to-teal-700',
      gradient: 'bg-gradient-to-br from-blue-600 to-teal-700'
    },
    {
      id: '5',
      name: 'Youth Center',
      type: 'Community Unit',
      logo: 'Y',
      duration: '2d agos',
      backgroundImage: 'bg-gradient-to-br from-gray-700 to-gray-900',
      gradient: 'bg-gradient-to-br from-gray-700 to-gray-900'
    },
    {
      id: '6',
      name: 'Auronico',
      type: 'Healthcare Unit',
      logo: 'A',
      duration: '6d agos',
      backgroundImage: 'bg-gradient-to-br from-teal-700 to-blue-800',
      gradient: 'bg-gradient-to-br from-teal-700 to-blue-800'
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
            <h1 className="text-2xl font-bold mb-2">Explore 6 Units just for you</h1>
          </div>

          {/* Units Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {units.map((unit) => (
              <Card key={unit.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className={`h-48 ${unit.gradient} relative flex items-center justify-center`}>
                  <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800 text-xs">
                    {unit.duration}
                  </Badge>
                  <div className="text-white text-center">
                    <h3 className="text-xl font-bold mb-1">{unit.name}</h3>
                    <p className="text-sm opacity-90">{unit.type}</p>
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
                        {unit.logo}
                      </div>
                      <span className="text-sm font-medium">{unit.name}</span>
                    </div>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Units;