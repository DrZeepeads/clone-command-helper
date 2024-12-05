import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Send } from "lucide-react";

export interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  isUploading: boolean;
}

export const ChatInput = ({
  message,
  setMessage,
  handleSendMessage,
  handleFileUpload,
  isLoading,
  isUploading
}: ChatInputProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4">
      <div className="max-w-3xl mx-auto flex gap-4 items-center">
        <input
          type="file"
          id="photo-upload"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
          onClick={() => document.getElementById('photo-upload')?.click()}
          disabled={isUploading}
        >
          <Camera className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Input
          placeholder="Ask me anything about pediatric care..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button 
          className="flex-shrink-0"
          onClick={handleSendMessage}
          disabled={isLoading || !message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};