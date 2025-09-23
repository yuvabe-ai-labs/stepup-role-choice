import { useState, useEffect, useRef } from 'react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    if (!content || isLoading) return;

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

      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: content,
          conversationHistory
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success && data?.response) {
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
      toast({
        title: "Error",
        description: "Sorry, I'm having trouble responding right now.",
        variant: "destructive",
      });
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
    if (lastBotMessage.includes('Profile Type')) {
      return ['Student', 'Fresher', 'Working'];
    }
    if (lastBotMessage.includes('Language')) {
      return ['English', 'Tamil', 'Hindi', 'French'];
    }
    return null;
  };

  if (!showChat) {
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
              Welcome to STEP-UP Internships
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Let's have a quick chat to personalize your internship journey! Our AI assistant
              will help you discover opportunities that match your passions.
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
                Hey mate! Let's know you better
              </h2>
              <p className="text-muted-foreground text-sm">
                Help me with all your personal details here
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