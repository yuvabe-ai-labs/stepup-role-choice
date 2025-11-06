import { supabase } from "@/integrations/supabase/client";

export const sendStatusMail = async ({
  applicationId,
  candidateName,
  candidateEmail,
  title,
  description,
  senderEmail,
  status,
}: {
  applicationId: string;
  candidateName: string;
  candidateEmail: string | string[];
  title: string;
  description: string;
  senderEmail: string;
  status: string;
}) => {
  try {
    // 🧾 Print everything being sent for transparency
    console.log("----------------------------------------------------");
    console.log(`📤 Sending "${status}" email...`);
    console.log("🧠 Payload details:");
    console.log({
      applicationId,
      candidateName,
      candidateEmail,
      title,
      description,
      senderEmail,
      status,
    });
    console.log("----------------------------------------------------");

    // 🚀 Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke(
      "schedule-interview",
      {
        body: {
          applicationId,
          candidateName,
          candidateEmail,
          title,
          description,
          senderEmail,
          status,
        },
      }
    );

    if (error) throw error;

    console.log(`✅ "${status}" email sent successfully to ${candidateEmail}`);
    console.log("📩 Response from Edge Function:", data);
    console.log("----------------------------------------------------");

    return { success: true, data };
  } catch (error: any) {
    console.error(`❌ Error sending "${status}" email:`, error.message);
    console.log("----------------------------------------------------");
    return { success: false, error: error.message };
  }
};
