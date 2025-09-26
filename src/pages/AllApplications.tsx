import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Search, Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Application {
  id: string;
  name: string;
  title: string;
  description: string;
  skills: string[];
  additionalSkills?: number;
  status: 'shortlisted' | 'applied' | 'rejected' | 'interviewed';
  avatar?: string;
}

const AllApplications = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const applications: Application[] = [
    {
      id: '1',
      name: 'Pankaj Sharma',
      title: 'UI/UX Designer',
      description: 'Passionate UI/UX designer with 3+ years of experience creating user-centered digital experiences.',
      skills: ['Figma', 'Wireframe', 'Sketch'],
      additionalSkills: 2,
      status: 'shortlisted'
    },
    {
      id: '2',
      name: 'Pankaj Sharma',
      title: 'UI/UX Designer',
      description: 'Passionate UI/UX designer with 3+ years of experience creating user-centered digital experiences.',
      skills: ['Figma', 'Wireframe', 'Sketch'],
      additionalSkills: 2,
      status: 'applied'
    },
    {
      id: '3',
      name: 'Pankaj Sharma',
      title: 'UI/UX Designer',
      description: 'Passionate UI/UX designer with 3+ years of experience creating user-centered digital experiences.',
      skills: ['Figma', 'Wireframe', 'Sketch'],
      additionalSkills: 2,
      status: 'rejected'
    },
    {
      id: '4',
      name: 'Pankaj Sharma',
      title: 'UI/UX Designer',
      description: 'Passionate UI/UX designer with 3+ years of experience creating user-centered digital experiences.',
      skills: ['Figma', 'Wireframe', 'Sketch'],
      additionalSkills: 2,
      status: 'interviewed'
    },
    {
      id: '5',
      name: 'Pankaj Sharma',
      title: 'UI/UX Designer',
      description: 'Passionate UI/UX designer with 3+ years of experience creating user-centered digital experiences.',
      skills: ['Figma', 'Wireframe', 'Sketch'],
      additionalSkills: 2,
      status: 'shortlisted'
    },
    {
      id: '6',
      name: 'Pankaj Sharma',
      title: 'UI/UX Designer',
      description: 'Passionate UI/UX designer with 3+ years of experience creating user-centered digital experiences.',
      skills: ['Figma', 'Wireframe', 'Sketch'],
      additionalSkills: 2,
      status: 'interviewed'
    }
  ];

  const getStatusBadge = (status: Application['status']) => {
    const statusConfig = {
      shortlisted: { label: 'Shortlisted', variant: 'default' as const, className: 'bg-green-100 text-green-700' },
      applied: { label: 'Applied', variant: 'secondary' as const, className: 'bg-orange-100 text-orange-700' },
      rejected: { label: 'Rejected', variant: 'destructive' as const, className: 'bg-red-100 text-red-700' },
      interviewed: { label: 'Interviewed', variant: 'default' as const, className: 'bg-blue-100 text-blue-700' }
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-teal-500 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Menu className="w-5 h-5" />
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src="" />
              <AvatarFallback>PK</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Back Button and Title */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/unit-dashboard')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">All Applications</h1>
        </div>

        {/* Applications Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl">
          {applications.map((application) => (
            <Card key={application.id} className="p-6">
              <CardContent className="p-0">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Avatar and Status */}
                  <div className="relative">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={application.avatar} />
                      <AvatarFallback className="text-lg font-semibold">
                        {application.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2">
                      {getStatusBadge(application.status)}
                    </div>
                  </div>

                  {/* Name and Title */}
                  <div>
                    <h3 className="font-semibold text-lg">{application.name}</h3>
                    <p className="text-muted-foreground text-sm">{application.title}</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {application.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {application.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {application.additionalSkills && (
                      <Badge variant="secondary" className="text-xs">
                        +{application.additionalSkills}
                      </Badge>
                    )}
                  </div>

                  {/* View Profile Button */}
                  <Button variant="outline" className="w-full mt-4">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllApplications;