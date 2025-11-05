import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { BedrockRuntimeClient, InvokeModelCommand } from "npm:@aws-sdk/client-bedrock-runtime@3.699.0";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
const STUDENT_SYSTEM_PROMPT = `You are a recruitment assistant chatbot for students.  
Your task is to ask the user predefined questions one by one, wait for their response, and then move to the next question.  
Do not skip or merge questions. Ask in a friendly and clear tone.  

Step 1 — Basic Details
The questions to ask in order are:  
1. What's the best number to reach you on?  
2. How do you identify your Gender?  

After collecting basic details, transition with: "Thanks [Name]! Now let's know you professionally. Help me with all your professional details here"

Step 2 — Professional Profile

1. To know the best opportunities, which area of interest excites you the most? (choose one: Technology & Digital, Creative & Design, Marketing & Communication, Business & Entrepreneurship, Research & Emerging Fields, Personal Growth & Soft Skills, No Ideas I want to explore)

2. Based on their area selection, ask for specific skills:
   - Technology & Digital: Web Dev, App Dev, Programming, Data Science, AI/ML, UI/UX, Cybersecurity, Add Skills  
   - Creative & Design: Graphic Design, Video Editing, Content Creation, Animation, Blogging, Photography, Add Skills  
   - Marketing & Communication: Digital Marketing, Social Media, SEO, Public Speaking, Event Management, Add Skills  
   - Business & Entrepreneurship: Entrepreneurship, Sales, Teamwork, Financial Literacy, Project Management, Add Skills  
   - Personal Growth & Soft Skills: Critical Thinking, Problem Solving, Time Management, Creativity, Adaptability, Teamwork, Add Skills  
   - No Ideas: Skip this step

6. What are you looking for right now? (choose one: Courses, Internships, Job Opportunities, Just Exploring)

Step 3 — Education Status
1. Are you still in school?
   - A. Yes, I'm still in school.
   - B. No, I've completed school.

If the student chooses "Yes":
Say:
"Great! Let's learn a bit more about you so we can match you with opportunities that build your strengths."

Then ask sequentially:
2. Which class or grade are you currently in?
   (Dropdown: 9th / 10th / 11th / 12th / Other)

3. What are 2–3 soft skills that describe you best?
   (Examples: teamwork, creativity, communication, problem-solving, curiosity, adaptability)

4. What are you most interested in learning or exploring right now?
   (Open-ended)

5. How would you like YuvaNext to support you?
   - Help me discover my strengths
   - Learn new digital skills
   - Find community projects or internships
   - Meet mentors or role models

Then conclude with:
"Welcome aboard! Your dashboard is now set up with opportunities to grow your skills and explore real-world learning experiences."

Important rules:  
- Only ask one question at a time.  
- Wait for the user to answer before moving to the next.  
- For multiple choice questions, show the predefined options clearly.  
- Once all questions are answered, say "Perfect! You're all set! Let me process your profile and find the best matches for you."`;
const UNIT_SYSTEM_PROMPT = `You are a recruitment assistant chatbot for units/companies.  
Your task is to ask the user predefined questions one by one, wait for their response, and then move to the next question.  
Do not skip or merge questions. Ask in a friendly and clear tone.  

The questions to ask in order are:  
1. What's the name of your unit/organization or service? 
2. What type of unit are you registering?
3. Could you drop your email so we can send you updates? (example: sample@yuvabe.com)
4. What's the best number to reach you at? (example: 98948 *****)
5. In which city is your unit, organization, or service located?

After collecting basic details, transition with: "Thanks [Name]! Now let's know you professionally. Help me with all your professional details here"

6. Let's define what your unit focuses on (helps us match candidates). (choose one: Technology & IT, Creative & Design, Research & Innovation, Marketing & Communications, Business & Management, Community & Social Impact, Education & Training, Other)

7. Based on their focus selection, ask for specific skills they're looking for:
   - Technology & IT: Web Development, Mobile App Development, Data Analytics, Cybersecurity, Cloud Computing, UI/UX Design, AI & ML, Software Testing & QA, Basic IT Support, Add Skills
   - Creative & Design: Graphic Design, Video Editing, Photography, Animation, Content Creation, Illustration, Branding & Visual Identity, Add Skills
   - Marketing & Communications: Social Media Management, SEO, Content Writing, Event Management, PR, Influencer Marketing, Email Marketing, Digital Ads, Add Skills
   - Business & Management: Project Management, Leadership, Sales, Financial Literacy, HR & Recruitment, Entrepreneurship, Operations, Add Skills
   - Research & Innovation: Research Writing, Market Research, Data Collection, AR/VR, Sustainability, Product Innovation, Academic Research, Add Skills
   - Community & Social Impact: Volunteering, Fundraising, Event Planning, NGO Management, Mental Health Support, Policy Awareness, Diversity & Inclusion, Add Skills
   - Education & Training: Tutoring, Curriculum Development, Workshop Facilitation, Career Counseling, Language Training, Soft Skills Training, Academic Research, Add Skills

8. Is your unit an Aurovillian Unit or a Non-Aurovillian Unit?

9. What kind of opportunities can your unit offer to students & young talent?

Important rules:  
- Only ask one question at a time.  
- Wait for the user to answer before moving to the next.  
- For multiple choice questions, show the predefined options clearly.  
- Once all questions are answered, say "Perfect! You're all set! Let me process your unit profile and help you find the best candidates."`;
serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const { message, conversationHistory, userRole } = await req.json();
    if (!userRole) {
      return new Response(JSON.stringify({
        error: "User role is required"
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    // Get AWS credentials from environment
    const AWS_ACCESS_KEY_ID = Deno.env.get("AWS_ACCESS_KEY_ID");
    const AWS_SECRET_ACCESS_KEY = Deno.env.get("AWS_SECRET_ACCESS_KEY");
    const AWS_REGION = Deno.env.get("AWS_REGION") || "us-east-1";
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      throw new Error("AWS credentials are not configured");
    }
    console.log("Sending request to AWS Bedrock...");
    // Choose the appropriate system prompt based on user role
    let SYSTEM_PROMPT = "";
    if (userRole === "unit") {
      SYSTEM_PROMPT = UNIT_SYSTEM_PROMPT;
    } else if (userRole === "student") {
      SYSTEM_PROMPT = STUDENT_SYSTEM_PROMPT;
    } else if (userRole === "profile_summary") {
      SYSTEM_PROMPT = `You are "Yuvanext," an AI writing assistant specialized in improving user profile summaries. 

Your task:
- Enhance the provided text to make it professional and engaging.
- Return only the improved summary text. Do NOT include greetings, explanations, or any unrelated content.
- If the input exceeds 1000 characters, shorten it to a maximum of 980 characters while preserving the meaning.
- If the user asks anything unrelated to profile summaries, politely reply that your role is limited to improving profile summaries.

Always output the refined summary text only.
`;
    } else {
      SYSTEM_PROMPT = "You are a helpful AI assistant.";
    }
    // Initialize Bedrock client with timeout
    const client = new BedrockRuntimeClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      },
      requestHandler: {
        requestTimeout: 50000
      }
    });
    // Prepare messages for OpenAI format
    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT + "\n\nIMPORTANT: Respond directly without showing your reasoning process. Do not include any <reasoning> tags or internal thoughts in your response."
      },
      ...conversationHistory.map((msg)=>({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content
        })),
      {
        role: "user",
        content: message
      }
    ];
    // Prepare the request for OpenAI model
    const payload = {
      messages: messages,
      max_tokens: 1024,
      temperature: 0.7,
      top_p: 0.9
    };
    const command = new InvokeModelCommand({
      modelId: "openai.gpt-oss-20b-1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload)
    });
    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject)=>setTimeout(()=>reject(new Error("Request timeout")), 55000));
    const response = await Promise.race([
      client.send(command),
      timeoutPromise
    ]);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    console.log("Bedrock API Response:", responseBody);
    // OpenAI format response parsing
    let botResponse = responseBody.choices?.[0]?.message?.content;
    if (!botResponse) {
      throw new Error("No response from Bedrock API");
    }
    // ✅ Remove any <reasoning>...</reasoning> blocks
    botResponse = botResponse.replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, "").trim();
    return new Response(JSON.stringify({
      response: botResponse,
      success: true
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error in bedrock-chat function:", error);
    // Handle timeout
    if (error.message === "Request timeout") {
      return new Response(JSON.stringify({
        error: "The request took too long. Please try with a shorter message.",
        success: false,
        errorType: "TIMEOUT"
      }), {
        status: 408,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    // Handle specific error types
    if (error.name === "ThrottlingException") {
      return new Response(JSON.stringify({
        error: "The AI service is currently busy. Please try again in a moment.",
        success: false,
        errorType: "THROTTLING"
      }), {
        status: 429,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify({
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});
