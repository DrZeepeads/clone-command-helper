import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Message {
  type: 'user' | 'bot';
  content: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export const handleModelLoading = async (retryCount: number) => {
  if (retryCount >= MAX_RETRIES) {
    toast.error('Model is still loading after multiple attempts. Please try again later.');
    return null;
  }

  toast.info('Model is loading, retrying in a moment...');
  await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
  return true;
};

export const sendMessage = async (
  message: string, 
  context: string, 
  retryCount: number
): Promise<string | null> => {
  console.log("Requesting AI response..."); // Debug log
  
  const { data: aiData, error: aiError } = await supabase.functions.invoke('medical-qa', {
    body: { 
      query: message,
      context
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });

  console.log("AI response full details:", { data: aiData, error: aiError }); // Debug log

  if (aiError) {
    const errorMessage = aiError.message || '';
    if (errorMessage.toLowerCase().includes('loading')) {
      return 'loading';
    }
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