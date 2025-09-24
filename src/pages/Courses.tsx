import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, Clock, Users, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Course {
  id: string;
  title: string;
  provider: string;
  duration: string;
  students: string;
  rating: number;
  price: string;
  description: string;
  skills: string[];
  image: string;
  gradient: string;
}

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const courses: Course[] = [
    {
      id: '1',
      title: 'AI & Machine Learning',
      provider: 'Tech Academy',
      duration: '12 weeks',
      students: '2.5k',
      rating: 4.8,
      price: '$199',
      description: 'Master the fundamentals of AI and machine learning with hands-on projects.',
      skills: ['Python', 'TensorFlow', 'Neural Networks'],
      image: 'Generative AI',
      gradient: 'bg-gradient-to-br from-blue-900 to-purple-900'
    },
    {
      id: '2',
      title: 'UI/UX Design',
      provider: 'Design Institute',
      duration: '8 weeks',
      students: '1.8k',
      rating: 4.7,
      price: '$149',
      description: 'Learn to create beautiful and intuitive user interfaces and experiences.',
      skills: ['Figma', 'User Research', 'Prototyping'],
      image: 'UX UI',
      gradient: 'bg-gradient-to-br from-purple-800 to-orange-600'
    },
    {
      id: '3',
      title: 'Full Stack Development',
      provider: 'Code Masters',
      duration: '16 weeks',
      students: '3.2k',
      rating: 4.9,
      price: '$299',
      description: 'Become a complete web developer with modern frameworks and technologies.',
      skills: ['React', 'Node.js', 'MongoDB'],
      image: 'Full Stack',
      gradient: 'bg-gradient-to-br from-cyan-500 to-blue-600'
    },
    {
      id: '4',
      title: 'Digital Marketing',
      provider: 'Marketing Pro',
      duration: '6 weeks',
      students: '1.5k',
      rating: 4.6,
      price: '$99',
      description: 'Master digital marketing strategies and grow your online presence.',
      skills: ['SEO', 'Social Media', 'Analytics'],
      image: 'Marketing',
      gradient: 'bg-gradient-to-br from-green-500 to-teal-600'
    },
    {
      id: '5',
      title: 'Data Science',
      provider: 'Data Academy',
      duration: '14 weeks',
      students: '2.1k',
      rating: 4.8,
      price: '$249',
      description: 'Analyze data and extract meaningful insights using statistical methods.',
      skills: ['Python', 'R', 'Statistics'],
      image: 'Data Science',
      gradient: 'bg-gradient-to-br from-red-500 to-pink-600'
    },
    {
      id: '6',
      title: 'Mobile App Development',
      provider: 'Mobile Tech',
      duration: '10 weeks',
      students: '1.9k',
      rating: 4.7,
      price: '$199',
      description: 'Build native and cross-platform mobile applications.',
      skills: ['React Native', 'Flutter', 'Swift'],
      image: 'Mobile Dev',
      gradient: 'bg-gradient-to-br from-indigo-500 to-purple-600'
    }
  ];

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Available Courses</h1>
          <p className="text-muted-foreground">Enhance your skills with our certified courses and advance your career</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses or providers..."
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

        {/* Courses Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
              <div className={`h-32 ${course.gradient} flex items-center justify-center relative`}>
                <div className="text-white text-lg font-bold">{course.image}</div>
                <Badge className="absolute top-3 right-3 bg-white/20 text-white border-white/30">
                  {course.price}
                </Badge>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">{course.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{course.provider}</p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-current text-yellow-500" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{course.students} students</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{course.duration}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {course.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full mt-4" size="sm">
                  Enroll Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;