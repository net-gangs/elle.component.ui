import { useState, useRef } from "react";
import { Loader2, Mic, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ChatInputArea({
  onSendMessage,
  isSendingMessage,
  placeholder,
  t,
}: {
  onSendMessage: (text: string) => void;
  isSendingMessage: boolean;
  placeholder: string;
  t: any;
}) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim() || isSendingMessage) return;
    onSendMessage(input);
    setInput("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <Textarea
        ref={textareaRef}
        placeholder={placeholder}
        rows={3}
        className="min-h-12 border-0 shadow-none focus-visible:ring-0 resize-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSendingMessage}
      />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            disabled={isSendingMessage}
            className="size-9 text-muted-foreground"
          >
            <Plus className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={isSendingMessage}
            className="size-9 text-muted-foreground"
          >
            <Mic className="size-5" />
          </Button>
        </div>
        <Button
          className="whitespace-nowrap"
          onClick={handleSend}
          disabled={!input.trim() || isSendingMessage}
        >
          {isSendingMessage ? (
            <Loader2 className="size-4 mr-2 animate-spin" />
          ) : (
            <Send className="size-4 mr-2" />
          )}
          {t("lessonPlanning.conversation.send")}
        </Button>
      </div>
    </div>
  );
}
