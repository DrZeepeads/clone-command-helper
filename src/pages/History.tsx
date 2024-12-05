import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ChatMessage {
  id: string;
  query: string;
  response: string;
  created_at: string;
}

const History = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) return;

        const { data, error } = await supabase
          .from('medical_queries')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        toast({
          title: "Error fetching history",
          description: "Could not load your chat history. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
      <h1 className="text-2xl font-bold mb-6">Chat History</h1>
      <div className="space-y-6">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No chat history yet.</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="bg-white rounded-lg shadow p-4 space-y-3">
              <div className="space-y-1">
                <p className="font-medium text-gray-900">You</p>
                <p className="text-gray-600">{message.query}</p>
              </div>
              {message.response && (
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">NelsonBot</p>
                  <p className="text-gray-600">{message.response}</p>
                </div>
              )}
              <p className="text-xs text-gray-400">
                {new Date(message.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;