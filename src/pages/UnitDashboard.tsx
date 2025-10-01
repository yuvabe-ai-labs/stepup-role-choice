import { useState } from 'react';
import { Bell, Menu, Search, Users, FileText, Calendar, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useUnitApplications } from '@/hooks/useUnitApplications';

const safeParse = (data: any, fallback: any) => {
  if (!data) return fallback;
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch {
    return fallback;
  }
};

const UnitDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('applications');
  const { applications, stats, loading } = useUnitApplications();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'interviewed':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      case 'hired':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return 'Shortlisted';
      case 'rejected':
        return 'Rejected';
      case 'interviewed':
        return 'Interview';
      case 'hired':
        return 'Hired';
      default:
        return 'Applied';
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
                  {loading ? (
                    <Skeleton className="h-10 w-16 my-1" />
                  ) : (
                    <>
                      <p className="text-3xl font-bold">{stats.total}</p>
                      <p className="text-xs text-muted-foreground">All time</p>
                    </>
                  )}
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
                  <p className="text-sm font-medium text-muted-foreground">Shortlisted</p>
                  {loading ? (
                    <Skeleton className="h-10 w-16 my-1" />
                  ) : (
                    <>
                      <p className="text-3xl font-bold">{stats.shortlisted}</p>
                      <p className="text-xs text-muted-foreground">Candidates</p>
                    </>
                  )}
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
                  {loading ? (
                    <Skeleton className="h-10 w-16 my-1" />
                  ) : (
                    <>
                      <p className="text-3xl font-bold">{stats.interviews}</p>
                      <p className="text-xs text-muted-foreground">Candidates</p>
                    </>
                  )}
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
                  <p className="text-sm font-medium text-muted-foreground">Hired</p>
                  {loading ? (
                    <Skeleton className="h-10 w-16 my-1" />
                  ) : (
                    <>
                      <p className="text-3xl font-bold">{stats.hired}</p>
                      <p className="text-xs text-muted-foreground">All time</p>
                    </>
                  )}
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
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="border border-border/50">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="flex-1">
                              <Skeleton className="h-5 w-32 mb-2" />
                              <Skeleton className="h-4 w-24 mb-3" />
                              <Skeleton className="h-3 w-full mb-4" />
                              <Skeleton className="h-8 w-full" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-2">No Applications Yet</h3>
                    <p className="text-muted-foreground">Applications for your internships will appear here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applications.slice(0, 6).map((application) => {
                      const skills = safeParse(application.studentProfile.skills, []);
                      const displaySkills = skills.slice(0, 3).map((s: any) => 
                        typeof s === 'string' ? s : s.name
                      );
                      
                      return (
                        <Card key={application.id} className="border border-border/50 hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <Avatar className="w-12 h-12">
                                <AvatarImage 
                                  src={application.studentProfile.avatar_url || undefined} 
                                  alt={application.profile.full_name} 
                                />
                                <AvatarFallback>
                                  {application.profile.full_name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="font-semibold text-foreground truncate">
                                    {application.profile.full_name}
                                  </h3>
                                  <Badge 
                                    variant="secondary" 
                                    className={getStatusColor(application.status)}
                                  >
                                    {getStatusLabel(application.status)}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {application.internship.title}
                                </p>
                                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                  {application.studentProfile.bio || 'No bio provided'}
                                </p>
                                <div className="flex flex-wrap gap-1 mb-4">
                                  {displaySkills.map((skill: string, index: number) => (
                                    <Badge 
                                      key={index} 
                                      variant="outline" 
                                      className="text-xs px-2 py-1 bg-muted/50"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                  {skills.length > 3 && (
                                    <Badge 
                                      variant="outline" 
                                      className="text-xs px-2 py-1 bg-muted/50"
                                    >
                                      +{skills.length - 3}
                                    </Badge>
                                  )}
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full"
                                  onClick={() => navigate(`/candidate/${application.id}`)}
                                >
                                  View Profile
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
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