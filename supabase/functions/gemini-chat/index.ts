import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const STUDENT_SYSTEM_PROMPT = `You are a recruitment assistant chatbot for students.  
Your task is to ask the user predefined questions one by one, wait for their response, and then move to the next question.  
Do not skip or merge questions. Ask in a friendly and clear tone.  

The questions to ask in order are:  
1. Please tell me your **Name**.  
2. Please provide your **Email address**.  
3. Please provide your **Phone Number**.  
4. What is your **Gender**?  
5. Please select your **Profile Type** (choose one: Student, Fresher, Working).  
6. Finally, please select a **Language** to continue the conversation (English, Tamil, Hindi, French).  

After collecting basic details, transition with: "Thanks [Name]! Now let's know you professionally. Help me with all your professional details here"

7. To know the best opportunities, which area of interest excites you the most? (choose one: Technology & Digital, Creative & Design, Marketing & Communication, Business & Entrepreneurship, Research & Emerging Fields, Personal Growth & Soft Skills, No Ideas I want to explore)

8. Based on their area selection, ask for specific skills:
   - Technology & Digital: Web Dev, App Dev, Programming, Data Science, AI/ML, UI/UX, Cybersecurity, Not sure / Add Skills
   - Creative & Design: Graphic Design, Video Editing, Content Creation, Animation, Blogging, Photography, Not sure / Add Skills  
   - Marketing & Communication: Digital Marketing, Social Media, SEO, Public Speaking, Event Management, Not sure / Add Skills
   - Business & Entrepreneurship: Entrepreneurship, Sales, Teamwork, Financial Literacy, Project Management, Not sure / Add Skills
   - Personal Growth & Soft Skills: Critical Thinking, Problem Solving, Time Management, Creativity, Adaptability, Teamwork, Not sure / Add Skills
   - No Ideas: Skip this step

9. What are you looking for right now? (choose one: Courses, Internships, Job Opportunities, Just Exploring)

Important rules:  
- Only ask one question at a time.  
- Wait for the user to answer before moving to the next.  
- For multiple choice questions, show the predefined options clearly.  
- Once all questions are answered, say "Perfect! You're all set! Let me process your profile and find the best matches for you."`;

const UNIT_SYSTEM_PROMPT = `You are a recruitment assistant chatbot for units/companies.  
Your task is to ask the user predefined questions one by one, wait for their response, and then move to the next question.  
Do not skip or merge questions. Ask in a friendly and clear tone.  

The questions to ask in order are:  
1. What's the name of your **unit/organization or service**? (Example: Upasana / Yuvabe / Marcs)
2. What **type of unit** are you registering? (choose one: Startup, NGO / Social Enterprise, Educational Institution, Corporate / Company, Government / Public Sector, Other)
3. Which **language** would you like me to continue in? (choose one: English, Tamil, Hindi, Telugu, French, +Add)
4. Could you drop your **email** so we can send you updates? (example: sample@yuvabe.com)
5. What's the best **number** to reach you at? (example: 98948 *****)
6. In which **city** is your unit, organization, or service located? (Example: Auroville, Pondy)

After collecting basic details, transition with: "Thanks [Name]! Now let's know you professionally. Help me with all your professional details here"

7. Let's define what your unit focuses on (helps us match candidates). (choose one: Technology & IT, Creative & Design, Research & Innovation, Marketing & Communications, Business & Management, Community & Social Impact, Education & Training, Other)

8. Based on their focus selection, ask for specific skills they're looking for:
   - Technology & IT: Web Development, Mobile App Development, Data Analytics, Cybersecurity, Cloud Computing, UI/UX Design, AI & ML, Software Testing & QA, Basic IT Support, Add Skills
   - Creative & Design: Graphic Design, Video Editing, Photography, Animation, Content Creation, Illustration, Branding & Visual Identity, Add Skills
   - Marketing & Communications: Social Media Management, SEO, Content Writing, Event Management, PR, Influencer Marketing, Email Marketing, Digital Ads, Add Skills
   - Business & Management: Project Management, Leadership, Sales, Financial Literacy, HR & Recruitment, Entrepreneurship, Operations, Add Skills
   - Research & Innovation: Research Writing, Market Research, Data Collection, AR/VR, Sustainability, Product Innovation, Academic Research, Add Skills
   - Community & Social Impact: Volunteering, Fundraising, Event Planning, NGO Management, Mental Health Support, Policy Awareness, Diversity & Inclusion, Add Skills
   - Education & Training: Tutoring, Curriculum Development, Workshop Facilitation, Career Counseling, Language Training, Soft Skills Training, Academic Research, Add Skills

9. Is your unit an **Aurovillian Unit or a Non-Aurovillian Unit**? (choose one: Aurovillian Unit, Non-Aurovillian Unit)

10. What kind of **opportunities** can your unit offer to students & young talent? (multiple selection: Internship Opportunities, Courses, Volunteering, Workshops, Job Opportunities, Mentorship Programs, Short-Term Projects)

Important rules:  
- Only ask one question at a time.  
- Wait for the user to answer before moving to the next.  
- For multiple choice questions, show the predefined options clearly.  
- Once all questions are answered, say "Perfect! You're all set! Let me process your unit profile and help you find the best candidates."`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory, userRole } = await req.json();

    if (!userRole) {
      return new Response(
        JSON.stringify({ error: 'User role is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const GEMINI_API_KEY = "AIzaSyCMY4PaMghn1w3hlsJiafuc66OKV8lrDU0";
    //  Deno.env.get('GEMINI_API_KEY');
    // if (!GEMINI_API_KEY) {
    //   throw new Error('GEMINI_API_KEY is not configured');
    // }

    console.log('Sending request to Gemini API...');
    
    // Choose the appropriate system prompt based on user role
    const SYSTEM_PROMPT = userRole === 'unit' ? UNIT_SYSTEM_PROMPT : STUDENT_SYSTEM_PROMPT;

    // Prepare the conversation context
    const messages = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }]
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', response.status, errorText);
      
      // Handle quota exceeded error specifically
      if (response.status === 429) {
        throw new Error('API_QUOTA_EXCEEDED');
      }
      
      throw new Error(`Gemini API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API Response:', data);

    const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!botResponse) {
      throw new Error('No response from Gemini API');
    }

    return new Response(JSON.stringify({ 
      response: botResponse,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in gemini-chat function:', error);
    
    // Handle specific error types
    if (error.message === 'API_QUOTA_EXCEEDED') {
      return new Response(JSON.stringify({ 
        error: 'The AI service has reached its daily limit. Please try again tomorrow or contact support.',
        success: false,
        errorType: 'QUOTA_EXCEEDED'
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});