import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Message {
  type: 'user' | 'bot';
  content: string;
}

export const handleModelLoading = async (retryCount: number) => {
  if (retryCount >= 3) {
    toast.error('Model is still loading after multiple attempts. Please try again later.');
    return false;
  }

  toast.info('Model is loading, retrying in a moment...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  return true;
};

export const sendMessage = async (
  query: string, 
  context: string, 
  retryCount: number
): Promise<string | 'loading' | null> => {
  try {
    console.log('Sending message:', { query, context, retryCount });
    
    const { data, error } = await supabase.functions.invoke('medical-qa', {
      body: { query, context },
    });

    console.log('Response:', { data, error });

    if (error) {
      console.error('Error from medical-qa:', error);
      throw error;
    }

    if (!data?.response) {
      if (data?.error === 'loading') {
        return 'loading';
      }
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format');
    }

    return data.response;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    toast.error('Failed to get response');
    return null;
  }
};