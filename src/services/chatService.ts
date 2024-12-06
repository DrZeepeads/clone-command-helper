import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Message {
  type: 'user' | 'bot';
  content: string;
}

export const handleModelLoading = async (retryCount: number) => {
  if (retryCount >= 3) {
    toast.error('Model is still loading after multiple attempts. Please try again later.');
    return null;
  }

  toast.info('Model is loading, retrying in a moment...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  return true;
};

export const sendMessage = async (
  query: string, 
  context: string, 
  retryCount: number
): Promise<string | null> => {
  console.log("Requesting AI response..."); // Debug log
  
  const { data: aiData, error: aiError } = await supabase.functions.invoke('medical-qa', {
    body: { 
      query,
      context
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });

  console.log("AI response full details:", { data: aiData, error: aiError }); // Debug log

  if (aiError) {
    console.error('AI response error:', aiError);
    toast.error('Failed to get response');
    return null;
  }

  if (!aiData?.response) {
    console.error('Invalid AI response format:', aiData);
    toast.error('Received invalid response format');
    return null;
  }

  return aiData.response;
};