import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Send, Sparkles } from "lucide-react";
import chatbotAvatar from "@/assets/chatbot.png";
import logo from "@/assets/logo-2.png";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const Chatbot = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
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
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [accumulatedUnitData, setAccumulatedUnitData] = useState<any>({});
  const [accumulatedStudentData, setAccumulatedStudentData] = useState<any>({});

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        console.log("Fetching profile for user:", user.id);
        setProfileLoading(true);
        setProfileError(null);

        const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();

        if (error) {
          console.error("Error fetching profile:", error);
          setProfileError("Failed to load profile. Please refresh the page.");
          setProfileLoading(false);
        } else if (data) {
          console.log("Profile fetched successfully:", data);
          setUserProfile(data);
          setProfileLoading(false);

          // Check if onboarding is completed
          if (data?.onboarding_completed) {
            setIsCompleted(true);
          }
        } else {
          console.error("No profile found for user");
          setProfileError("Profile not found. Please try signing in again.");
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
      role: "assistant",
      timestamp: new Date(),
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, transitionMessage]);

      // Ask the first professional question
      const professionalQuestion: Message = {
        id: (Date.now() + 1).toString(),
        content: "To know the best opportunities, which area of interest excites you the most?",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, professionalQuestion]);
      setIsTyping(false);
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const startChat = async () => {
    setShowChat(true);
    setIsTyping(true);

    setTimeout(() => {
      // Prefer full_name from userProfile, fallback to user_metadata, then email, then generic greeting
      const name = userProfile.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

      const initialMessage: Message = {
        id: "1",
        content: `Hey 👋, ${name}! Let's get to know you better.`,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const stringToArray = (value: string): string[] => {
    if (value.includes(",")) {
      return value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0);
    }
    return [value.trim()];
  };

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue.trim();
    const userRole = userProfile?.role;

    if (!content || isLoading || !userRole) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setIsTyping(true);

    // Store user data based on conversation context
    await storeUserData(content);

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      console.log("Sending message to chatbot with role:", userRole);
      const { data, error } = await supabase.functions.invoke("gemini-chat", {
        body: {
          message: content,
          conversationHistory,
          userRole,
        },
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
        if (
          data.response.includes("Perfect! You're all set!") ||
          data.response.includes("find the best matches") ||
          data.response.includes("find the best candidates")
        ) {
          setTimeout(async () => {
            // Mark onboarding as completed
            try {
              console.log("Updating onboarding completion for user:", user?.id);
              const { data: updateData, error: updateError } = await supabase
                .from("profiles")
                .update({ onboarding_completed: true })
                .eq("user_id", user?.id)
                .select();

              if (updateError) {
                console.error("Error updating onboarding status:", updateError);
                toast({
                  title: "Update Error",
                  description: "Failed to update onboarding status: " + updateError.message,
                  variant: "destructive",
                });
              } else {
                console.log("Successfully updated onboarding status:", updateData);
              }
            } catch (error) {
              console.error("Error updating onboarding status:", error);
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
            role: "assistant",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false);
        }, 1500);
      } else {
        throw new Error(data?.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setIsTyping(false);

      // Handle quota exceeded error
      if (error.message && error.message.includes("quota")) {
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

  // Updated storeUserData function for better unit data collection
  // Replace the existing storeUserData function with this improved version

  const storeUserData = async (userResponse: string) => {
    if (!user?.id) return;

    const lastBotMessage = messages.filter((m) => m.role === "assistant").slice(-1)[0]?.content || "";
    const isUnit = userProfile?.role === "unit";

    try {
      let profileUpdateData: any = {}; // For profiles table (basic info only)
      let roleSpecificData: any = {}; // For student_profiles or units table

      // For students
      if (!isUnit) {
        // STUDENT DATA COLLECTION

        // Phone number (question 3) - store in profiles
        if (
          lastBotMessage.toLowerCase().includes("phone number") ||
          lastBotMessage.toLowerCase().includes("phone") ||
          lastBotMessage.toLowerCase().includes("number")
        ) {
          profileUpdateData.phone = userResponse.trim();
          console.log("Storing phone number:", userResponse);
        }

        // Gender (question 4) - store in profiles
        if (lastBotMessage.toLowerCase().includes("gender")) {
          profileUpdateData.gender = userResponse.trim();
          console.log("Storing gender:", userResponse);
        }

        // Profile Type (question 5) - store in student_profiles
        if (lastBotMessage.toLowerCase().includes("profile type")) {
          roleSpecificData.profile_type = userResponse.trim();
          console.log("Storing profile type:", userResponse);
        }

        // Interest Area (question 6) - store in student_profiles
        if (
          lastBotMessage.toLowerCase().includes("area of interest") ||
          lastBotMessage.toLowerCase().includes("which area")
        ) {
          roleSpecificData.interests = stringToArray(userResponse);
          console.log("Storing interests as array:", roleSpecificData.interests);
        }

        // Skills (after area of interest selection) - store in student_profiles
        if (
          lastBotMessage.includes("Technology & Digital") ||
          lastBotMessage.includes("Creative & Design") ||
          lastBotMessage.includes("Marketing & Communication") ||
          lastBotMessage.includes("Business & Entrepreneurship") ||
          lastBotMessage.includes("Personal Growth & Soft Skills")
        ) {
          roleSpecificData.skills = stringToArray(userResponse);
          console.log("Storing skills as array:", roleSpecificData.skills);
        }

        // Looking for - store in student_profiles
        if (lastBotMessage.toLowerCase().includes("looking for right now")) {
          roleSpecificData.looking_for = stringToArray(userResponse);
          console.log("Storing looking_for:", roleSpecificData.looking_for);
        }

        // Education Level - store in student_profiles
        if (
          lastBotMessage.toLowerCase().includes("education") ||
          lastBotMessage.toLowerCase().includes("studying") ||
          lastBotMessage.toLowerCase().includes("grade")
        ) {
          roleSpecificData.experience_level = userResponse.trim();
          console.log("Storing education level:", userResponse);
        }

        // Bio/About - store in student_profiles
        if (
          lastBotMessage.toLowerCase().includes("about yourself") ||
          lastBotMessage.toLowerCase().includes("tell me more") ||
          lastBotMessage.toLowerCase().includes("describe yourself")
        ) {
          roleSpecificData.bio = userResponse.trim();
          console.log("Storing bio:", userResponse);
        }
      } else {
        // UNIT DATA COLLECTION

        // Unit Name - FIRST PROFESSIONAL QUESTION
        if (
          lastBotMessage.toLowerCase().includes("name of your unit") ||
          lastBotMessage.toLowerCase().includes("what is your unit called") ||
          lastBotMessage.toLowerCase().includes("unit name") ||
          lastBotMessage.toLowerCase().includes("organization name") ||
          lastBotMessage.toLowerCase().includes("what's the name")
        ) {
          roleSpecificData.unit_name = userResponse.trim();
          console.log("✅ Storing unit name:", userResponse);
        }

        // Unit Type/Category - SECOND PROFESSIONAL QUESTION
        if (
          lastBotMessage.toLowerCase().includes("type of unit") ||
          lastBotMessage.toLowerCase().includes("category") ||
          lastBotMessage.toLowerCase().includes("what kind of unit") ||
          lastBotMessage.toLowerCase().includes("unit's type")
        ) {
          roleSpecificData.unit_type = userResponse.trim();
          console.log("✅ Storing unit type:", userResponse);
        }

        // Unit Description - store in units
        if (
          lastBotMessage.toLowerCase().includes("describe your unit") ||
          lastBotMessage.toLowerCase().includes("what does your unit do") ||
          lastBotMessage.toLowerCase().includes("about your unit")
        ) {
          roleSpecificData.description = userResponse.trim();
          console.log("Storing unit description:", userResponse);
        }

        // Phone number - store in units
        if (
          lastBotMessage.includes("number") ||
          lastBotMessage.toLowerCase().includes("number to reach") ||
          (lastBotMessage.toLowerCase().includes("phone") && lastBotMessage.toLowerCase().includes("unit")) ||
          lastBotMessage.toLowerCase().includes("contact number")
        ) {
          roleSpecificData.contact_phone = userResponse.trim();
          console.log("Storing unit phone number:", userResponse);
        }

        if (lastBotMessage.includes("email")) {
          roleSpecificData.contact_email = userResponse.trim();
          console.log("Storing unit email:", userResponse);
        }

        if (lastBotMessage.includes("city")) {
          roleSpecificData.address = userResponse.trim();
          console.log("Storing unit location:", userResponse);
        }

        // Unit Address/Location - store in units
        if (
          lastBotMessage.toLowerCase().includes("location") ||
          lastBotMessage.toLowerCase().includes("address") ||
          lastBotMessage.toLowerCase().includes("where is your unit")
        ) {
          roleSpecificData.address = userResponse.trim();
          console.log("Storing unit address:", userResponse);
        }

        // Unit Website - store in units
        if (
          lastBotMessage.toLowerCase().includes("website") ||
          lastBotMessage.toLowerCase().includes("web address") ||
          lastBotMessage.toLowerCase().includes("url")
        ) {
          roleSpecificData.website_url = userResponse.trim();
          console.log("Storing website:", userResponse);
        }

        // Focus Areas/Interests - store in units
        if (
          lastBotMessage.toLowerCase().includes("what your unit focuses on") ||
          lastBotMessage.toLowerCase().includes("focus areas") ||
          lastBotMessage.toLowerCase().includes("areas of focus")
        ) {
          roleSpecificData.focus_areas = stringToArray(userResponse);
          console.log("Storing unit Focus area", roleSpecificData.focus_areas);
        }

        // Skills offered by unit
        if (
          lastBotMessage.includes("Technology & IT") ||
          lastBotMessage.includes("Creative & Design") ||
          lastBotMessage.includes("Marketing & Communications") ||
          lastBotMessage.includes("Business & Management") ||
          lastBotMessage.includes("Research & Innovation") ||
          lastBotMessage.includes("Community & Social Impact") ||
          lastBotMessage.includes("Education & Training")
        ) {
          roleSpecificData.skills_offered = stringToArray(userResponse);
          console.log("Storing skills offered:", roleSpecificData.skills_offered);
        }

        // Services Offered - store in units as opportunities_offered
        if (
          lastBotMessage.toLowerCase().includes("opportunities can your unit offer") ||
          lastBotMessage.includes("opportunities") ||
          lastBotMessage.toLowerCase().includes("services") ||
          lastBotMessage.toLowerCase().includes("what do you offer") ||
          lastBotMessage.toLowerCase().includes("programs")
        ) {
          roleSpecificData.opportunities_offered = stringToArray(userResponse);
          console.log("Storing opportunities offered:", roleSpecificData.opportunities_offered);
        }

        // Mission - store in units
        if (
          lastBotMessage.toLowerCase().includes("mission") ||
          lastBotMessage.toLowerCase().includes("purpose") ||
          lastBotMessage.toLowerCase().includes("goal")
        ) {
          roleSpecificData.mission = userResponse.trim();
          console.log("Storing mission:", userResponse);
        }

        // Aurovillian status
        if (lastBotMessage.toLowerCase().includes("aurovillian unit") || lastBotMessage.includes("Aurovillian Unit")) {
          const response = userResponse.toLowerCase();

          if (response.includes("non-aurovillian")) {
            roleSpecificData.is_aurovillian = false;
          } else if (response.includes("aurovillian")) {
            roleSpecificData.is_aurovillian = true;
          } else {
            // fallback if response unclear
            roleSpecificData.is_aurovillian = null;
          }

          console.log("Storing Aurovillian status:", roleSpecificData.is_aurovillian);
        }
      }

      // Update profiles table if we have basic profile data
      if (Object.keys(profileUpdateData).length > 0) {
        console.log("Updating profiles table with:", profileUpdateData);
        const { data, error } = await supabase
          .from("profiles")
          .update(profileUpdateData)
          .eq("user_id", user.id)
          .select();

        if (error) {
          console.error("Error updating profiles data:", error);
        } else {
          console.log("Successfully updated profiles data:", data);
        }
      }

      // Update role-specific table if we have role-specific data
      if (Object.keys(roleSpecificData).length > 0) {
        // Get profile_id first
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return;
        }

        const profileId = profileData.id;

        if (!isUnit) {
          // STUDENT: Accumulate data
          const updatedStudentData = {
            ...accumulatedStudentData,
            ...roleSpecificData,
          };
          setAccumulatedStudentData(updatedStudentData);

          console.log("📝 Updating student_profiles with accumulated data:", updatedStudentData);
          const { data, error } = await supabase
            .from("student_profiles")
            .upsert({ profile_id: profileId, ...updatedStudentData }, { onConflict: "profile_id" })
            .select();

          if (error) {
            console.error("❌ Error updating student_profiles:", error);
          } else {
            console.log("✅ Successfully updated student_profiles:", data);
          }
        } else {
          // UNIT: Accumulate data to avoid null constraint violations
          const updatedUnitData = {
            ...accumulatedUnitData,
            ...roleSpecificData,
          };
          setAccumulatedUnitData(updatedUnitData);

          console.log("📝 Updating units table with accumulated data:", {
            profile_id: profileId,
            ...updatedUnitData,
          });

          const { data, error } = await supabase
            .from("units")
            .upsert({ profile_id: profileId, ...updatedUnitData }, { onConflict: "profile_id" })
            .select();

          if (error) {
            console.error("❌ Error updating units:", error);
            console.error("Full error details:", {
              code: error.code,
              message: error.message,
              details: error.details,
              hint: error.hint,
            });
          } else {
            console.log("✅ Successfully updated units:", data);
          }
        }

        // Update local state
        setUserProfile((prev: any) => ({
          ...prev,
          ...profileUpdateData,
          ...roleSpecificData,
        }));
      }
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  };

  const getQuestionType = (lastBotMessage: string) => {
    const multiSelectQuestions = [
      "opportunities can your unit offer",
      "Technology & IT",
      "Creative & Design",
      "Marketing & Communications",
      "Business & Management",
      "Research & Innovation",
      "Community & Social Impact",
      "Education & Training",
      "Technology & Digital",
    ];

    return multiSelectQuestions.some((q) => lastBotMessage.includes(q)) ? "multi" : "single";
  };

  useEffect(() => {
    const lastBotMsg = messages[messages.length - 1]?.content || "";
    const questionType = getQuestionType(lastBotMsg);
    setIsMultiSelect(questionType === "multi");
    setSelectedOptions([]);
  }, [messages]);

  const handleOptionClick = (option: string) => {
    if (option === "Add Skills" || option === "Not sure / Add Skills") {
      // Allow manual input
      sendMessage(option);
      return;
    }

    if (isMultiSelect) {
      setSelectedOptions((prev) => {
        if (prev.includes(option)) {
          return prev.filter((o) => o !== option);
        } else {
          return [...prev, option];
        }
      });
    } else {
      sendMessage(option);
      setSelectedOptions([]);
    }
  };

  const handleSubmitMultiSelect = () => {
    if (selectedOptions.length > 0) {
      sendMessage(selectedOptions.join(", "));
      setSelectedOptions([]);
    }
  };

  const renderQuickOptions = (options: string[]) => {
    return (
      <div className="space-y-2 mt-2">
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const isSelected = selectedOptions.includes(option);
            return (
              <Button
                key={option}
                onClick={() => handleOptionClick(option)}
                disabled={isLoading}
                className={`px-4 py-2 border rounded-full text-sm transition-colors ${
                  isSelected ? "border-blue-500 bg-blue-500 text-white" : "border-blue-500 text-blue-600"
                }`}
                variant="ghost"
                size="sm"
              >
                {option}
                {isSelected && isMultiSelect && " ✓"}
              </Button>
            );
          })}
        </div>

        {isMultiSelect && selectedOptions.length > 0 && (
          <div className="flex gap-2 items-center">
            <Button
              onClick={handleSubmitMultiSelect}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700"
              size="sm"
            >
              Submit ({selectedOptions.length} selected)
            </Button>
            <Button
              onClick={() => setSelectedOptions([])}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-full text-sm"
              variant="ghost"
              size="sm"
            >
              Clear
            </Button>
          </div>
        )}
      </div>
    );
  };

  const getQuickOptions = (lastBotMessage: string) => {
    const isUnit = userProfile?.role === "unit";

    if (isUnit) {
      // Unit-specific options
      if (lastBotMessage.includes("type of unit")) {
        return [
          "Startup",
          "NGO / Social Enterprise",
          "Educational Institution",
          "Corporate / Company",
          "Government / Public Sector",
          "Other",
        ];
      }
      if (lastBotMessage.includes("language")) {
        return ["English", "Tamil", "Hindi", "Telugu", "French"];
      }
      if (lastBotMessage.includes("Gender")) {
        return ["Male", "Female", "Prefer not to say"];
      }
      if (lastBotMessage.includes("what your unit focuses on")) {
        return [
          "Technology & IT",
          "Creative & Design",
          "Research & Innovation",
          "Marketing & Communications",
          "Business & Management",
          "Community & Social Impact",
          "Education & Training",
          "Other",
        ];
      }
      if (lastBotMessage.includes("Technology & IT")) {
        return [
          "Web Development",
          "Mobile App Development",
          "Data Analytics",
          "Cybersecurity",
          "Cloud Computing",
          "UI/UX Design",
          "AI & ML",
          "Add Skills",
        ];
      }
      if (lastBotMessage.includes("Creative & Design")) {
        return [
          "Graphic Design",
          "Video Editing",
          "Photography",
          "Animation",
          "Content Creation",
          "Illustration",
          "Add Skills",
        ];
      }
      if (lastBotMessage.includes("Marketing & Communications")) {
        return [
          "Social Media Management",
          "SEO",
          "Content Writing",
          "Event Management",
          "PR",
          "Influencer Marketing",
          "Add Skills",
        ];
      }
      if (lastBotMessage.includes("Business & Management")) {
        return [
          "Project Management",
          "Leadership",
          "Sales",
          "Financial Literacy",
          "HR & Recruitment",
          "Entrepreneurship",
          "Add Skills",
        ];
      }
      if (lastBotMessage.includes("Research & Innovation")) {
        return [
          "Research Writing",
          "Market Research",
          "Data Collection",
          "AR/VR",
          "Sustainability",
          "Product Innovation",
          "Add Skills",
        ];
      }
      if (lastBotMessage.includes("Community & Social Impact")) {
        return [
          "Volunteering",
          "Fundraising",
          "Event Planning",
          "NGO Management",
          "Mental Health Support",
          "Add Skills",
        ];
      }
      if (lastBotMessage.includes("Education & Training")) {
        return [
          "Tutoring",
          "Curriculum Development",
          "Workshop Facilitation",
          "Career Counseling",
          "Language Training",
          "Add Skills",
        ];
      }
      if (lastBotMessage.includes("Aurovillian Unit")) {
        return ["Aurovillian Unit", "Non-Aurovillian Unit"];
      }
      if (lastBotMessage.includes("opportunities")) {
        return [
          "Internship Opportunities",
          "Courses",
          "Volunteering",
          "Workshops",
          "Job Opportunities",
          "Mentorship Programs",
        ];
      }
    } else {
      // Student-specific options
      if (lastBotMessage.includes("Profile Type")) {
        return ["Student", "Fresher", "Working"];
      }
      if (lastBotMessage.includes("Language")) {
        return ["English", "Tamil", "Hindi", "French"];
      }
      if (lastBotMessage.includes("Gender")) {
        return ["Male", "Female", "Prefer not to say"];
      }
      if (lastBotMessage.includes("area of interest")) {
        return [
          "Technology & Digital",
          "Creative & Design",
          "Marketing & Communication",
          "Business & Entrepreneurship",
          "Research & Emerging Fields",
          "Personal Growth & Soft Skills",
          "No Ideas, I want to explore",
        ];
      }
      if (lastBotMessage.includes("Technology & Digital")) {
        return [
          "Web Dev",
          "App Dev",
          "Programming",
          "Data Science",
          "AI/ML",
          "UI/UX",
          "Cybersecurity",
          "Not sure / Add Skills",
        ];
      }
      if (lastBotMessage.includes("Creative & Design")) {
        return [
          "Graphic Design",
          "Video Editing",
          "Content Creation",
          "Animation",
          "Blogging",
          "Photography",
          "Not sure / Add Skills",
        ];
      }
      if (lastBotMessage.includes("Marketing & Communication")) {
        return [
          "Digital Marketing",
          "Social Media",
          "SEO",
          "Public Speaking",
          "Event Management",
          "Not sure / Add Skills",
        ];
      }
      if (lastBotMessage.includes("Business & Entrepreneurship")) {
        return [
          "Entrepreneurship",
          "Sales",
          "Teamwork",
          "Financial Literacy",
          "Project Management",
          "Not sure / Add Skills",
        ];
      }
      if (lastBotMessage.includes("Personal Growth & Soft Skills")) {
        return [
          "Critical Thinking",
          "Problem Solving",
          "Time Management",
          "Creativity",
          "Adaptability",
          "Teamwork",
          "Not sure / Add Skills",
        ];
      }
      if (lastBotMessage.includes("looking for right now")) {
        return ["Courses", "Internships", "Job Opportunities", "Just Exploring"];
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
    const isUnit = userProfile?.role === "unit";

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-muted flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md mx-auto space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <a href="/">
              <img src={logo} alt="Company Logo" className="h-30 w-auto cursor-pointer" />
            </a>
          </div>

          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
              {isUnit ? "Welcome to YuvaNext Unit Portal" : "Welcome to YuvaNext Internships"}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isUnit
                ? "Let's have a quick chat to set up your unit profile! Our AI assistant will help you connect with the best candidates for your opportunities."
                : "Let's have a quick chat to personalize your internship journey! Our AI assistant will help you discover opportunities that match your passions."}
            </p>
          </div>

          {/* Bot Avatar */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <img src={chatbotAvatar} alt="AI Assistant" className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                {isUnit ? "Hey there! Let's know your unit better" : "Hey mate! Let's know you better"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isUnit ? "Help me with all your unit details here" : "Help me with all your personal details here"}
              </p>
            </div>
          </div>

          {/* Get Started Button */}
          <Button
            onClick={startChat}
            size="lg"
            className="bg-gradient-to-br from-[#07636C] to-[#0694A2] hover:opacity-90 text-white px-8 py-3 rounded-full font-medium transition-opacity"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  if (showProfessionalTransition) {
    const isUnit = userProfile?.role === "unit";

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-muted flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md mx-auto space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <a href="/">
              <img src={logo} alt="Company Logo" className="h-30 w-auto cursor-pointer" />
            </a>
          </div>

          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
              {isUnit ? "Welcome to YuvaNext Unit Portal" : "Welcome to YuvaNext Internships"}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isUnit
                ? "Let's have a quick chat to set up your unit profile! Our AI assistant will help you connect with the best candidates for your opportunities."
                : "Let's have a quick chat to personalize your internship journey! Our AI assistant will help you discover opportunities that match your passions."}
            </p>
          </div>

          {/* Bot Avatar */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <img src={chatbotAvatar} alt="AI Assistant" className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Thanks {userProfile.full_name?.split(" ")[0] || "there"}!{" "}
                {isUnit ? "Now let's know your unit professionally" : "Now let's know you professionally"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isUnit
                  ? "Help me with all your unit's professional details here"
                  : "Help me with all your professional details here"}
              </p>
            </div>
          </div>

          {/* Get Started Button */}
          <Button
            onClick={continueToProfessional}
            size="lg"
            className="bg-gradient-to-br from-[#07636C] to-[#0694A2] hover:opacity-90 text-white px-8 py-3 rounded-full font-medium transition-opacity"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const isUnit = userProfile?.role === "unit";

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-muted flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-2xl mx-auto space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <a href="/">
              <img src={logo} alt="Company Logo" className="h-30 w-auto cursor-pointer" />
            </a>
          </div>

          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground">🎉 You're All Set!</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isUnit ? "Here's your unit profile summary:" : "Here's your personalized profile summary:"}
            </p>
          </div>

          {/* Profile Summary */}
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">👋</span>
              <h2 className="text-xl font-semibold text-foreground">
                {isUnit
                  ? `Hello ${userProfile.full_name || "Unit"}!`
                  : `Hello ${userProfile.full_name?.split(" ")[0] || "there"}!`}
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
                    console.log("Updating onboarding completion for user:", user?.id);
                    // Update onboarding status in database
                    const { data: updateData, error } = await supabase
                      .from("profiles")
                      .update({ onboarding_completed: true })
                      .eq("user_id", user?.id)
                      .select();

                    if (error) {
                      console.error("Error updating onboarding status:", error);
                      toast({
                        title: "Update Error",
                        description: "Failed to update onboarding status: " + error.message,
                        variant: "destructive",
                      });
                    } else {
                      console.log("Successfully updated onboarding status:", updateData);
                      toast({
                        title: "Profile Complete!",
                        description: "Your onboarding has been completed successfully.",
                        variant: "default",
                      });
                      // Navigate to appropriate dashboard based on user role
                      const dashboardPath = isUnit ? "/unit-dashboard" : "/dashboard";
                      navigate(dashboardPath, { replace: true });
                    }
                  } catch (error: any) {
                    console.error("Error updating onboarding status:", error);
                    toast({
                      title: "Update Error",
                      description: "Failed to update onboarding status",
                      variant: "destructive",
                    });
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="bg-gradient-to-br from-[#07636C] to-[#0694A2] hover:opacity-90 text-white px-8 py-3 rounded-full font-medium transition-opacity"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isLoading ? "Setting up..." : isUnit ? "Explore Dashboard" : "Explore My Dashboard"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const lastBotMessage = messages.filter((m) => m.role === "assistant").slice(-1)[0]?.content || "";
  const quickOptions = getQuickOptions(lastBotMessage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-muted flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl mx-auto h-[80vh] flex flex-col">
        {/* Logo and Welcome */}
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <a href="/">
              <img src={logo} alt="Company Logo" className="h-30 w-auto cursor-pointer" />
            </a>
          </div>
          <h1 className="text-xl font-bold text-foreground my-4">Welcome to YuvaNext Internships</h1>
          <p className="text-muted-foreground text-sm">
            Let's have a quick chat to personalize your internship journey! Our AI assistant will help you discover
            opportunities that match your passions.
          </p>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto space-y-4 mb-4 px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {" "}
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start space-x-3 max-w-[80%] ${
                  message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img src={chatbotAvatar} alt="AI Assistant" className="w-full h-full object-cover" />
                  </div>
                )}
                <Card
                  className={`p-3 rounded-3xl border ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-12"
                      : "bg-transparent border-blue-500 text-blue-600"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </Card>
              </div>
            </div>
          ))}
          {/* Quick Options */}
          {quickOptions && messages.length > 0 && !isTyping && !isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%]">{renderQuickOptions(quickOptions)}</div>
            </div>
          )}
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-[80%]">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img src={chatbotAvatar} alt="AI Assistant" className="w-full h-full object-cover" />
                </div>
                <div className="px-4 py-2 border border-blue-500 text-blue-600 rounded-full">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="mt-4">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your answer"
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={isLoading}
              className="flex-1 rounded-full border border-gray-300"
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="px-4 rounded-full flex items-center space-x-2"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
