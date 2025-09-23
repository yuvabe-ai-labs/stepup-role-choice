import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Users, ArrowRight, BookOpen, Trophy, Target } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  role: string;
}

const CourseRecommendation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const recommendedCourses = [
    {
      id: 1,
      title: "Junior UI Designer",
      duration: "6 Months",
      type: "Full Time",
      icon: "🎨",
      color: "bg-yellow-100",
      difficulty: "Beginner"
    },
    {
      id: 2,
      title: "Marketing Manager",
      duration: "4 Months",
      type: "Full Time",
      icon: "📈",
      color: "bg-red-100",
      difficulty: "Intermediate"
    },
    {
      id: 3,
      title: "Managing Director",
      duration: "8 Months",
      type: "Part Time",
      icon: "👔",
      color: "bg-purple-100",
      difficulty: "Advanced"
    }
  ];

  const certifiedCourses = [
    {
      id: 1,
      title: "Generative AI",
      subtitle: "AI & Machine Learning",
      duration: "2 Months",
      difficulty: "Beginner",
      color: "bg-gradient-to-r from-purple-600 to-blue-600",
      textColor: "text-white"
    },
    {
      id: 2,
      title: "UX Design",
      subtitle: "UI/UX Design",
      duration: "3 Months",
      difficulty: "Intermediate",
      color: "bg-gradient-to-r from-orange-500 to-yellow-500",
      textColor: "text-white"
    },
    {
      id: 3,
      title: "Full Stack Development",
      subtitle: "Web Development",
      duration: "6 Months",
      difficulty: "Advanced",
      color: "bg-gradient-to-r from-blue-600 to-cyan-600",
      textColor: "text-white"
    }
  ];

  const activities = [
    {
      id: 1,
      title: "Junior Designer",
      type: "Design",
      rating: "4.8/5",
      duration: "Full Time",
      description: "We're committed to developing creatively with expertise."
    },
    {
      id: 2,
      title: "Marketing Manager",
      type: "Marketing",
      rating: "4.7/5",
      duration: "Full Time",
      description: "Build exceptional experiences by blending creativity with strategy."
    },
    {
      id: 3,
      title: "Education - Trainer",
      type: "Education",
      rating: "4.9/5",
      duration: "Full Time",
      description: "Build expertise by teaching and mentoring others in creative fields."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur border-b px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    [0, 3, 6].includes(i) ? 'bg-primary' : 'bg-primary/60'
                  }`}
                />
              ))}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">STEP-UP</h1>
              <div className="flex space-x-6 text-sm text-muted-foreground">
                <span>Internships</span>
                <span>Courses</span>
                <span>Units</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg border bg-background/50 text-sm w-64"
              />
              <div className="absolute left-3 top-2.5 text-muted-foreground">🔍</div>
            </div>
            <Button
              onClick={handleGoToDashboard}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {profile?.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{profile?.full_name || 'User'}</h3>
                  <Badge variant="secondary" className="mt-2">
                    {profile?.role || 'Student'}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profile Performance</span>
                    <Badge variant="outline">85%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-medium">15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">In Progress</span>
                    <span className="font-medium">4</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Trophy className="w-4 h-4 mr-2" />
                  View Achievements
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Banner */}
            <Card className="bg-gradient-to-r from-blue-100 to-cyan-100 border-0">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">
                      🎉 Welcome {profile?.full_name?.split(' ')[0] || 'there'}!
                    </h2>
                    <p className="text-gray-600">
                      Here are your personalized course recommendations
                    </p>
                  </div>
                  <div className="text-6xl">🎓</div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Courses */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Recommended for you</h2>
                <Button variant="ghost" size="sm">
                  View all <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {recommendedCourses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className={`w-12 h-12 ${course.color} rounded-lg flex items-center justify-center text-2xl`}>
                          {course.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{course.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
                            <Clock className="w-4 h-4" />
                            <span>{course.duration}</span>
                            <span>•</span>
                            <span>{course.type}</span>
                          </div>
                        </div>
                        <Badge variant="outline">{course.difficulty}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Certified Courses */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Certified Courses for you</h2>
                <Button variant="ghost" size="sm">
                  View all <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {certifiedCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className={`${course.color} p-6 ${course.textColor}`}>
                      <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                      <p className="text-sm opacity-90">{course.subtitle}</p>
                      <div className="flex items-center space-x-4 mt-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}</span>
                        </div>
                        <Badge variant="secondary" className="bg-white/20">
                          {course.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Interview Preparation Banner */}
            <Card className="bg-gradient-to-r from-orange-100 to-red-100 border-0">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      🤖 Start your interview preparation for top companies in Auroville
                    </h3>
                    <p className="text-gray-600 text-sm">10 Questions left</p>
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Start Practice
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Your Activity */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Your Activity</h2>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">Saved</Button>
                  <Button variant="ghost" size="sm">Applied</Button>
                </div>
              </div>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <Card key={activity.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center text-white font-bold">
                            {activity.title.charAt(0)}
                          </div>
                          <div className="space-y-2">
                            <div>
                              <h3 className="font-semibold text-foreground">{activity.title}</h3>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Badge variant="outline">{activity.type}</Badge>
                                <span>•</span>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span>{activity.rating}</span>
                                </div>
                                <span>•</span>
                                <span>{activity.duration}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-red-500">
                            Not Interested
                          </Button>
                          <Button size="sm">
                            Apply
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseRecommendation;