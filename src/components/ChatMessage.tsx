import { cn } from "@/lib/utils";

export interface ChatMessageProps {
  type: 'user' | 'bot';
  content: string;
}

export const ChatMessage = ({ type, content }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "p-4 rounded-lg max-w-[80%]",
        type === 'user' 
          ? "bg-primary text-primary-foreground ml-auto" 
          : "bg-muted mr-auto"
      )}
    >
      {content}
    </div>
  );
};