import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are a recruitment assistant chatbot.  
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    console.log('Sending request to Gemini API...');

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

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});