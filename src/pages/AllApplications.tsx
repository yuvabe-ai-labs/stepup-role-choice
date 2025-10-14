import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Search, Bell, Menu, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUnitApplications } from '@/hooks/useUnitApplications';

const AllApplications = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { applications, loading, error } = useUnitApplications();

  // Filter applications based on search query
  const filteredApplications = useMemo(() => {
    if (!searchQuery.trim()) return applications;
    
    const query = searchQuery.toLowerCase();
    return applications.filter(app => 
      app.profile.full_name.toLowerCase().includes(query) ||
      app.internship.title.toLowerCase().includes(query) ||
      app.status.toLowerCase().includes(query)
    );
  }, [applications, searchQuery]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive'; className: string }> = {
      shortlisted: { label: 'Shortlisted', variant: 'default', className: 'bg-green-100 text-green-700' },
      applied: { label: 'Applied', variant: 'secondary', className: 'bg-orange-100 text-orange-700' },
      rejected: { label: 'Rejected', variant: 'destructive', className: 'bg-red-100 text-red-700' },
      interviewed: { label: 'Interviewed', variant: 'default', className: 'bg-blue-100 text-blue-700' },
      hired: { label: 'Hired', variant: 'default', className: 'bg-purple-100 text-purple-700' }
    };

    const config = statusConfig[status] || statusConfig.applied;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

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
          {filteredApplications.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? 'No applications found matching your search.' : 'No applications yet.'}
              </p>
            </div>
          ) : (
            filteredApplications.map((application) => {
              const skills = Array.isArray(application.studentProfile.skills) 
                ? application.studentProfile.skills.slice(0, 3)
                : [];
              const additionalSkills = Array.isArray(application.studentProfile.skills)
                ? Math.max(0, application.studentProfile.skills.length - 3)
                : 0;

              return (
                <Card key={application.id} className="p-6">
                  <CardContent className="p-0">
                    <div className="flex flex-col items-center text-center space-y-4">
                      {/* Avatar and Status */}
                      <div className="relative">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={application.studentProfile.avatar_url || undefined} />
                          <AvatarFallback className="text-lg font-semibold">
                            {application.profile.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-2 -right-2">
                          {getStatusBadge(application.status)}
                        </div>
                      </div>

                      {/* Name and Title */}
                      <div>
                        <h3 className="font-semibold text-lg">{application.profile.full_name}</h3>
                        <p className="text-muted-foreground text-sm">{application.internship.title}</p>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {typeof application.studentProfile.bio === 'string' 
                          ? application.studentProfile.bio 
                          : Array.isArray(application.studentProfile.bio)
                          ? application.studentProfile.bio.join(' ')
                          : 'No bio available'}
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap justify-center gap-2">
                        {skills.map((skill: any, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {typeof skill === 'string' ? skill : skill.name}
                          </Badge>
                        ))}
                        {additionalSkills > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            +{additionalSkills}
                          </Badge>
                        )}
                      </div>

                      {/* View Profile Button */}
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => navigate(`/candidate-profile/${application.id}`)}
                      >
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AllApplications;