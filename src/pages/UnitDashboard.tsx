import { useState } from 'react';
import { Bell, Menu, Search, Users, FileText, Calendar, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Candidate {
  id: string;
  name: string;
  role: string;
  description: string;
  skills: string[];
  status: 'Shortlisted' | 'Rejected' | 'Interview' | 'Hired';
  avatar: string;
}

const UnitDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('applications');

  const mockCandidates: Candidate[] = [
    {
      id: '1',
      name: 'Pankaj Sharma',
      role: 'Front-End Developer',
      description: 'Passionate UI/UX designer with 3+ years of experience creating user-centered digital experiences.',
      skills: ['Figma', 'Wireframe', 'Sketch', '+2'],
      status: 'Shortlisted',
      avatar: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Sanksr Sharma',
      role: 'Visual Designer',
      description: 'Passionate UI/UX designer with 3+ years of experience creating user-centered digital experiences.',
      skills: ['Figma', 'Wireframe', 'Sketch', '+2'],
      status: 'Rejected',
      avatar: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Pooja Agarwal',
      role: 'Business Analyst',
      description: 'Passionate UI/UX designer with 3+ years of experience creating user-centered digital experiences.',
      skills: ['Figma', 'Wireframe', 'Sketch', '+2'],
      status: 'Rejected',
      avatar: '/placeholder.svg'
    },
    {
      id: '4',
      name: 'Ranjith Singh',
      role: 'Market Researcher',
      description: 'Passionate UI/UX designer with 3+ years of experience creating user-centered digital experiences.',
      skills: ['Figma', 'Wireframe', 'Sketch', '+2'],
      status: 'Interview',
      avatar: '/placeholder.svg'
    },
    {
      id: '5',
      name: 'Rithika Agarwal',
      role: 'Marketing Associate',
      description: 'Passionate UI/UX designer with 3+ years of experience creating user-centered digital experiences.',
      skills: ['Figma', 'Wireframe', 'Sketch', '+2'],
      status: 'Shortlisted',
      avatar: '/placeholder.svg'
    },
    {
      id: '6',
      name: 'Krunal Sharma',
      role: 'UI/UX Designer',
      description: 'Passionate UI/UX designer with 3+ years of experience creating user-centered digital experiences.',
      skills: ['Figma', 'Wireframe', 'Sketch', '+2'],
      status: 'Interview',
      avatar: '/placeholder.svg'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'Interview':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      case 'Hired':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full"></div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 bg-muted/30 border-muted"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Menu className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 bg-orange-400 rounded-sm"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-sm"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-sm"></div>
                <div className="w-2 h-2 bg-green-400 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                  <p className="text-3xl font-bold">85</p>
                  <p className="text-xs text-green-600">+30% from last month</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Job Descriptions</p>
                  <p className="text-3xl font-bold">23</p>
                  <p className="text-xs text-green-600">+2 this week</p>
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Interview Scheduled</p>
                  <p className="text-3xl font-bold">2</p>
                  <p className="text-xs text-blue-600">2 interviews today</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Hired This Month</p>
                  <p className="text-3xl font-bold">4</p>
                  <p className="text-xs text-green-600">Goal: 6 Candidates</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/30 p-1 rounded-full">
            <TabsTrigger 
              value="applications" 
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Applications
            </TabsTrigger>
            <TabsTrigger 
              value="job-descriptions"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Job Descriptions
            </TabsTrigger>
            <TabsTrigger 
              value="candidates"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Candidates Management
            </TabsTrigger>
            <TabsTrigger 
              value="reports"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            {/* Recent Applications */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">Recent Applications</CardTitle>
                <Button 
                  variant="link" 
                  className="text-primary"
                  onClick={() => navigate('/all-applications')}
                >
                  View all
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockCandidates.map((candidate) => (
                    <Card key={candidate.id} className="border border-border/50 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={candidate.avatar} alt={candidate.name} />
                            <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-foreground truncate">{candidate.name}</h3>
                              <Badge 
                                variant="secondary" 
                                className={getStatusColor(candidate.status)}
                              >
                                {candidate.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{candidate.role}</p>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                              {candidate.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-4">
                              {candidate.skills.map((skill, index) => (
                                <Badge 
                                  key={index} 
                                  variant="outline" 
                                  className="text-xs px-2 py-1 bg-muted/50"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="job-descriptions">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-2">Job Descriptions</h3>
                  <p className="text-muted-foreground">Manage your job postings and descriptions here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="candidates">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-2">Candidates Management</h3>
                  <p className="text-muted-foreground">Manage candidate profiles and applications here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-2">Reports</h3>
                  <p className="text-muted-foreground">View analytics and reports for your hiring process.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UnitDashboard;