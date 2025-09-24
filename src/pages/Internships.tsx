import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, Clock, MapPin, Building } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  type: string;
  postedTime: string;
  description: string;
  requirements: string[];
  color: string;
}

const Internships = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const internships: Internship[] = [
    {
      id: '1',
      title: 'Junior UI Designer',
      company: 'TechCorp',
      location: 'Remote',
      duration: '6 Months',
      type: 'Full Time',
      postedTime: '1d ago',
      description: 'Join our design team to create intuitive user interfaces and enhance user experiences.',
      requirements: ['Figma', 'Adobe Creative Suite', 'UI/UX Design'],
      color: 'bg-green-100 border-green-200'
    },
    {
      id: '2',
      title: 'Marketing Manager',
      company: 'Digital Solutions',
      location: 'New York',
      duration: '6 Months',
      type: 'Full Time',
      postedTime: '1w ago',
      description: 'Lead marketing campaigns and drive brand awareness across multiple channels.',
      requirements: ['Digital Marketing', 'Analytics', 'Content Strategy'],
      color: 'bg-blue-100 border-blue-200'
    },
    {
      id: '3',
      title: 'Managing Director Intern',
      company: 'Global Corp',
      location: 'San Francisco',
      duration: '6 Months',
      type: 'Full Time',
      postedTime: '2d ago',
      description: 'Work closely with senior management to develop strategic business initiatives.',
      requirements: ['Business Strategy', 'Leadership', 'Analytics'],
      color: 'bg-purple-100 border-purple-200'
    },
    {
      id: '4',
      title: 'Software Engineer Intern',
      company: 'StartupXYZ',
      location: 'Austin',
      duration: '3 Months',
      type: 'Part Time',
      postedTime: '3d ago',
      description: 'Develop and maintain web applications using modern technologies.',
      requirements: ['React', 'JavaScript', 'Node.js'],
      color: 'bg-orange-100 border-orange-200'
    },
    {
      id: '5',
      title: 'Data Analyst Intern',
      company: 'Analytics Pro',
      location: 'Chicago',
      duration: '4 Months',
      type: 'Full Time',
      postedTime: '1w ago',
      description: 'Analyze large datasets to derive meaningful insights for business decisions.',
      requirements: ['Python', 'SQL', 'Tableau'],
      color: 'bg-pink-100 border-pink-200'
    },
    {
      id: '6',
      title: 'Product Management Intern',
      company: 'Innovation Labs',
      location: 'Seattle',
      duration: '6 Months',
      type: 'Full Time',
      postedTime: '4d ago',
      description: 'Support product development lifecycle and coordinate with cross-functional teams.',
      requirements: ['Product Strategy', 'Agile', 'Market Research'],
      color: 'bg-cyan-100 border-cyan-200'
    }
  ];

  const filteredInternships = internships.filter(internship =>
    internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Internship Opportunities</h1>
          <p className="text-muted-foreground">Discover amazing internship opportunities that match your skills and interests</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search internships or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </Button>
        </div>

        {/* Internships Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInternships.map((internship) => (
            <Card key={internship.id} className={`shadow-sm hover:shadow-md transition-shadow cursor-pointer ${internship.color}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {internship.postedTime}
                  </Badge>
                  <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center">
                    <Building className="w-5 h-5 text-background" />
                  </div>
                </div>
                <CardTitle className="text-lg font-semibold">{internship.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{internship.company}</p>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {internship.description}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{internship.duration} - {internship.type}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{internship.location}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {internship.requirements.slice(0, 3).map((req) => (
                    <Badge key={req} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full mt-4" size="sm">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInternships.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No internships found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Internships;