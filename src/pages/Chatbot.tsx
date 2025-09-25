import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Send, Sparkles } from 'lucide-react';
import chatbotAvatar from '@/assets/chatbot-avatar.png';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const Chatbot = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showProfessionalTransition, setShowProfessionalTransition] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        console.log('Fetching profile for user:', user.id);
        setProfileLoading(true);
        setProfileError(null);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setProfileError('Failed to load profile. Please refresh the page.');
          setProfileLoading(false);
        } else if (data) {
          console.log('Profile fetched successfully:', data);
          setUserProfile(data);
          setProfileLoading(false);
          
          // Check if onboarding is completed
          if (data?.onboarding_completed) {
            setIsCompleted(true);
          }
        } else {
          console.error('No profile found for user');
          setProfileError('Profile not found. Please try signing in again.');
          setProfileLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const continueToProfessional = () => {
    setShowProfessionalTransition(false);
    setShowChat(true);
    setIsTyping(true);
    
    // Add the professional transition message to chat history
    const transitionMessage: Message = {
      id: Date.now().toString(),
      content: "Thanks! Now let's know you professionally. Help me with all your professional details here",
      role: 'assistant',
      timestamp: new Date()
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, transitionMessage]);
      
      // Ask the first professional question
      const professionalQuestion: Message = {
        id: (Date.now() + 1).toString(),
        content: "To know the best opportunities, which area of interest excites you the most?",
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, professionalQuestion]);
      setIsTyping(false);
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const startChat = async () => {
    setShowChat(true);
    setIsTyping(true);
    
    // Simulate initial bot message delay
    setTimeout(() => {
      const initialMessage: Message = {
        id: '1',
        content: "Hey 👋, what's your name?",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages([initialMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue.trim();
    const userRole = userProfile?.role;
    
    if (!content || isLoading || !userRole) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      console.log('Sending message to chatbot with role:', userRole);
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: content,
          conversationHistory,
          userRole
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success && data?.response) {
        // Check if this is the professional transition
        if (data.response.includes("Now let's know you professionally")) {
          setTimeout(() => {
            setShowProfessionalTransition(true);
            setIsTyping(false);
          }, 1500);
          return;
        }

        // Check if conversation is complete
        if (data.response.includes("Perfect! You're all set!") || data.response.includes("find the best matches") || data.response.includes("find the best candidates")) {
          setTimeout(async () => {
            // Mark onboarding as completed
            try {
              console.log('Updating onboarding completion for user:', user?.id);
              const { data: updateData, error: updateError } = await supabase
                .from('profiles')
                .update({ onboarding_completed: true })
                .eq('user_id', user?.id)
                .select();
              
              if (updateError) {
                console.error('Error updating onboarding status:', updateError);
                toast({
                  title: "Update Error",
                  description: "Failed to update onboarding status: " + updateError.message,
                  variant: "destructive",
                });
              } else {
                console.log('Successfully updated onboarding status:', updateData);
              }
            } catch (error) {
              console.error('Error updating onboarding status:', error);
              toast({
                title: "Update Error", 
                description: "Failed to update onboarding status",
                variant: "destructive",
              });
            }
            
            setIsCompleted(true);
            setIsTyping(false);
          }, 1500);
          return;
        }

        setTimeout(() => {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: data.response,
            role: 'assistant',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
        }, 1500);
      } else {
        throw new Error(data?.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      
      // Handle quota exceeded error
      if (error.message && error.message.includes('quota')) {
        toast({
          title: "Daily Limit Reached",
          description: "The AI service has reached its daily limit. Please try again tomorrow.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Sorry, I'm having trouble responding right now.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderQuickOptions = (options: string[]) => {
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {options.map((option) => (
          <Button
            key={option}
            variant="outline"
            size="sm"
            onClick={() => sendMessage(option)}
            disabled={isLoading}
            className="text-sm"
          >
            {option}
          </Button>
        ))}
      </div>
    );
  };

  const getQuickOptions = (lastBotMessage: string) => {
    const isUnit = userProfile?.role === 'unit';
    
    if (isUnit) {
      // Unit-specific options
      if (lastBotMessage.includes('type of unit')) {
        return ['Startup', 'NGO / Social Enterprise', 'Educational Institution', 'Corporate / Company', 'Government / Public Sector', 'Other'];
      }
      if (lastBotMessage.includes('language')) {
        return ['English', 'Tamil', 'Hindi', 'Telugu', 'French'];
      }
      if (lastBotMessage.includes('what your unit focuses on')) {
        return ['Technology & IT', 'Creative & Design', 'Research & Innovation', 'Marketing & Communications', 'Business & Management', 'Community & Social Impact', 'Education & Training', 'Other'];
      }
      if (lastBotMessage.includes('Technology & IT')) {
        return ['Web Development', 'Mobile App Development', 'Data Analytics', 'Cybersecurity', 'Cloud Computing', 'UI/UX Design', 'AI & ML', 'Add Skills'];
      }
      if (lastBotMessage.includes('Creative & Design')) {
        return ['Graphic Design', 'Video Editing', 'Photography', 'Animation', 'Content Creation', 'Illustration', 'Add Skills'];
      }
      if (lastBotMessage.includes('Marketing & Communications')) {
        return ['Social Media Management', 'SEO', 'Content Writing', 'Event Management', 'PR', 'Influencer Marketing', 'Add Skills'];
      }
      if (lastBotMessage.includes('Business & Management')) {
        return ['Project Management', 'Leadership', 'Sales', 'Financial Literacy', 'HR & Recruitment', 'Entrepreneurship', 'Add Skills'];
      }
      if (lastBotMessage.includes('Research & Innovation')) {
        return ['Research Writing', 'Market Research', 'Data Collection', 'AR/VR', 'Sustainability', 'Product Innovation', 'Add Skills'];
      }
      if (lastBotMessage.includes('Community & Social Impact')) {
        return ['Volunteering', 'Fundraising', 'Event Planning', 'NGO Management', 'Mental Health Support', 'Add Skills'];
      }
      if (lastBotMessage.includes('Education & Training')) {
        return ['Tutoring', 'Curriculum Development', 'Workshop Facilitation', 'Career Counseling', 'Language Training', 'Add Skills'];
      }
      if (lastBotMessage.includes('Aurovillian Unit')) {
        return ['Aurovillian Unit', 'Non-Aurovillian Unit'];
      }
      if (lastBotMessage.includes('opportunities can your unit offer')) {
        return ['Internship Opportunities', 'Courses', 'Volunteering', 'Workshops', 'Job Opportunities', 'Mentorship Programs'];
      }
    } else {
      // Student-specific options
      if (lastBotMessage.includes('Profile Type')) {
        return ['Student', 'Fresher', 'Working'];
      }
      if (lastBotMessage.includes('Language')) {
        return ['English', 'Tamil', 'Hindi', 'French'];
      }
      if (lastBotMessage.includes('area of interest')) {
        return ['Technology & Digital', 'Creative & Design', 'Marketing & Communication', 'Business & Entrepreneurship', 'Research & Emerging Fields', 'Personal Growth & Soft Skills', 'No Ideas, I want to explore'];
      }
      if (lastBotMessage.includes('Technology & Digital')) {
        return ['Web Dev', 'App Dev', 'Programming', 'Data Science', 'AI/ML', 'UI/UX', 'Cybersecurity', 'Not sure / Add Skills'];
      }
      if (lastBotMessage.includes('Creative & Design')) {
        return ['Graphic Design', 'Video Editing', 'Content Creation', 'Animation', 'Blogging', 'Photography', 'Not sure / Add Skills'];
      }
      if (lastBotMessage.includes('Marketing & Communication')) {
        return ['Digital Marketing', 'Social Media', 'SEO', 'Public Speaking', 'Event Management', 'Not sure / Add Skills'];
      }
      if (lastBotMessage.includes('Business & Entrepreneurship')) {
        return ['Entrepreneurship', 'Sales', 'Teamwork', 'Financial Literacy', 'Project Management', 'Not sure / Add Skills'];
      }
      if (lastBotMessage.includes('Personal Growth & Soft Skills')) {
        return ['Critical Thinking', 'Problem Solving', 'Time Management', 'Creativity', 'Adaptability', 'Teamwork', 'Not sure / Add Skills'];
      }
      if (lastBotMessage.includes('looking for right now')) {
        return ['Courses', 'Internships', 'Job Opportunities', 'Just Exploring'];
      }
    }
    return null;
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">Loading your profile...</div>
          <div className="text-sm text-muted-foreground">Setting up your personalized experience</div>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium mb-2 text-destructive">Profile Error</div>
          <div className="text-sm text-muted-foreground mb-4">{profileError}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!showChat) {
    const isUnit = userProfile?.role === 'unit';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-muted flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md mx-auto space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${
                    [0, 3, 6].includes(i) ? 'bg-primary' : 'bg-primary/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
              {isUnit ? 'Welcome to STEP-UP Unit Portal' : 'Welcome to STEP-UP Internships'}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isUnit 
                ? "Let's have a quick chat to set up your unit profile! Our AI assistant will help you connect with the best candidates for your opportunities."
                : "Let's have a quick chat to personalize your internship journey! Our AI assistant will help you discover opportunities that match your passions."
              }
            </p>
          </div>

          {/* Bot Avatar */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <img 
                src={chatbotAvatar} 
                alt="AI Assistant" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                {isUnit ? 'Hey there! Let\'s know your unit better' : 'Hey mate! Let\'s know you better'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isUnit 
                  ? 'Help me with all your unit details here'
                  : 'Help me with all your personal details here'
                }
              </p>
            </div>
          </div>

          {/* Get Started Button */}
          <Button 
            onClick={startChat}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-medium"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  if (showProfessionalTransition) {
    const isUnit = userProfile?.role === 'unit';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-muted flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md mx-auto space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${
                    [0, 3, 6].includes(i) ? 'bg-primary' : 'bg-primary/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
              {isUnit ? 'Welcome to STEP-UP Unit Portal' : 'Welcome to STEP-UP Internships'}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isUnit 
                ? "Let's have a quick chat to set up your unit profile! Our AI assistant will help you connect with the best candidates for your opportunities."
                : "Let's have a quick chat to personalize your internship journey! Our AI assistant will help you discover opportunities that match your passions."
              }
            </p>
          </div>

          {/* Bot Avatar */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <img 
                src={chatbotAvatar} 
                alt="AI Assistant" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Thanks {userProfile.full_name?.split(' ')[0] || 'there'}! {isUnit ? 'Now let\'s know your unit professionally' : 'Now let\'s know you professionally'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isUnit 
                  ? 'Help me with all your unit\'s professional details here'
                  : 'Help me with all your professional details here'
                }
              </p>
            </div>
          </div>

          {/* Get Started Button */}
          <Button 
            onClick={continueToProfessional}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-medium"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const isUnit = userProfile?.role === 'unit';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-muted flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-2xl mx-auto space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${
                    [0, 3, 6].includes(i) ? 'bg-primary' : 'bg-primary/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
              🎉 You're All Set!
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isUnit 
                ? "Here's your unit profile summary:"
                : "Here's your personalized profile summary:"
              }
            </p>
          </div>

          {/* Profile Summary */}
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">👋</span>
              <h2 className="text-xl font-semibold text-foreground">
                {isUnit 
                  ? `Hello ${userProfile.full_name || 'Unit'}!`
                  : `Hello ${userProfile.full_name?.split(' ')[0] || 'there'}!`
                }
              </h2>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {isUnit ? (
                <>
                  <Card className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">25</div>
                      <div className="text-sm text-muted-foreground">Potential Candidates</div>
                      <div className="text-xs text-muted-foreground">Matching your requirements</div>
                    </div>
                  </Card>

                  <Card className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">8</div>
                      <div className="text-sm text-muted-foreground">Skill Matches</div>
                      <div className="text-xs text-muted-foreground">Perfect for your unit</div>
                    </div>
                  </Card>

                  <Card className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📋</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">3</div>
                      <div className="text-sm text-muted-foreground">Active Listings</div>
                      <div className="text-xs text-muted-foreground">Ready to post</div>
                    </div>
                  </Card>
                </>
              ) : (
                <>
                  <Card className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📅</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">5</div>
                      <div className="text-sm text-muted-foreground">Matching Internships</div>
                      <div className="text-xs text-muted-foreground">Found in business domain</div>
                    </div>
                  </Card>

                  <Card className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto bg-teal-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🏢</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">12</div>
                      <div className="text-sm text-muted-foreground">Auroville Units</div>
                      <div className="text-xs text-muted-foreground">Relevant to your skills</div>
                    </div>
                  </Card>

                  <Card className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">3</div>
                      <div className="text-sm text-muted-foreground">Skill Courses</div>
                      <div className="text-xs text-muted-foreground">To boost your profile</div>
                    </div>
                  </Card>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                size="lg"
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  
                  try {
                    console.log('Updating onboarding completion for user:', user?.id);
                    // Update onboarding status in database
                    const { data: updateData, error } = await supabase
                      .from('profiles')
                      .update({ onboarding_completed: true })
                      .eq('user_id', user?.id)
                      .select();
                    
                    if (error) {
                      console.error('Error updating onboarding status:', error);
                      toast({
                        title: "Update Error",
                        description: "Failed to update onboarding status: " + error.message,
                        variant: "destructive",
                      });
                    } else {
                      console.log('Successfully updated onboarding status:', updateData);
                      toast({
                        title: "Profile Complete!",
                        description: "Your onboarding has been completed successfully.",
                        variant: "default",
                      });
                      // Navigate to dashboard
                      navigate('/dashboard', { replace: true });
                    }
                  } catch (error: any) {
                    console.error('Error updating onboarding status:', error);
                    toast({
                      title: "Update Error",
                      description: "Failed to update onboarding status",
                      variant: "destructive",
                    });
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-medium min-w-[200px]"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isLoading ? 'Setting up...' : (isUnit ? 'Explore Dashboard' : 'Explore Opportunities')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const lastBotMessage = messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content || '';
  const quickOptions = getQuickOptions(lastBotMessage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-muted flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-card/50 backdrop-blur">
        <div className="flex justify-center">
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
        </div>
        <h1 className="text-center text-lg font-semibold mt-2">STEP-UP Internships</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {message.role === 'assistant' && (
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={chatbotAvatar} 
                    alt="AI Assistant" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <Card className={`p-3 ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground ml-12' 
                  : 'bg-card border'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </Card>
            </div>
          </div>
        ))}

        {/* Quick Options */}
        {quickOptions && messages.length > 0 && !isTyping && !isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%]">
              {renderQuickOptions(quickOptions)}
            </div>
          </div>
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src={chatbotAvatar} 
                  alt="AI Assistant" 
                  className="w-full h-full object-cover"
                />
              </div>
              <Card className="p-3 bg-card border">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </Card>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-card/50 backdrop-blur">
        <div className="flex space-x-2 max-w-2xl mx-auto">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your answer"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;