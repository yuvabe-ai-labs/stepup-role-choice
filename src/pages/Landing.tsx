import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Building } from 'lucide-react';
import stepupIllustration from '@/assets/stepup-illustration.jpg';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            StepUp
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take the next step in your journey. Choose your path to get started.
          </p>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Illustration */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <img 
                src={stepupIllustration} 
                alt="StepUp Progress Illustration" 
                className="w-full h-auto rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl"></div>
            </div>
          </div>

          {/* Right Side - Role Selection */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Choose Your Role
              </h2>
              <p className="text-muted-foreground text-lg">
                Select the option that best describes you to access your personalized dashboard.
              </p>
            </div>

            <div className="space-y-4">
              {/* Student Card */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <Link to="/auth/student/signin" className="block">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <GraduationCap className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-1">
                          Student
                        </h3>
                        <p className="text-muted-foreground">
                          Access your courses, assignments, and track your progress
                        </p>
                      </div>
                      <div className="text-muted-foreground group-hover:text-primary transition-colors">
                        →
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              {/* Unit Card */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <Link to="/auth/unit/signin" className="block">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                          <Building className="w-6 h-6 text-accent" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-1">
                          Unit
                        </h3>
                        <p className="text-muted-foreground">
                          Manage courses, students, and institutional resources
                        </p>
                      </div>
                      <div className="text-muted-foreground group-hover:text-primary transition-colors">
                        →
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Footer Text */}
            <div className="text-center lg:text-left pt-6">
              <p className="text-sm text-muted-foreground">
                New to StepUp? Create an account after selecting your role.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;