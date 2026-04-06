import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  RefreshCcw,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDataStore } from "@/contexts/data-store";
import { getChatResponse } from "@/lib/chat-api";
import { cn } from "@/lib/utils";

const MarkdownBold = ({ text }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: "Hello! I'm Zorvyn AI. How can I help you with your financial dashboard today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const dashboardData = useDataStore();

  const scrollToBottom = () => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: "smooth"
        });
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(scrollToBottom, 100);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [messages, isOpen, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { 
      role: "user", 
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => ({ 
        role: m.role, 
        content: m.content 
      }));
      chatHistory.push({ role: "user", content: input });

      const response = await getChatResponse(chatHistory, dashboardData);
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: response,
        timestamp: new Date()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error. Please check your API key or connection.",
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[-1] pointer-events-auto"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: "100%", scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "pointer-events-auto bg-card shadow-2xl border border-border flex flex-col overflow-hidden",
              "fixed bottom-0 inset-x-0 h-[85dvh] sm:static sm:h-[600px] sm:w-[420px] sm:mb-4 rounded-t-2xl sm:rounded-2xl"
            )}
          >
            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between shadow-sm shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center border border-primary-foreground/20">
                  <img src="https://media.licdn.com/dms/image/v2/D4D0BAQF6cfpCh0Eg6w/company-logo_200_200/B4DZipL2HGHwAI-/0/1755185113638?e=2147483647&v=beta&t=-uiMvnQKxYJ9bbY5OkIizOaMrqbJqWVDCLmJgXD7DtI" alt="Zorvyn AI" className="w-full h-full rounded-full" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg leading-none flex items-center gap-1.5">
                    Zorvyn AI
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  </h3>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="hover:bg-primary-foreground/10 text-primary-foreground"
              >
                <ChevronDown className="w-6 h-6 sm:hidden" />
                <X className="w-5 h-5 hidden sm:block" />
              </Button>
            </div>

            <div className="flex-1 min-h-0 relative overscroll-contain">
              <ScrollArea 
                ref={scrollRef} 
                className="h-full w-full"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                <div className="p-4 flex flex-col gap-4 pb-8">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn(
                        "flex max-w-[85%] flex-col gap-1.5",
                        msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm",
                          msg.role === "user" 
                            ? "bg-primary text-primary-foreground rounded-tr-none" 
                            : cn(
                                "bg-muted border border-border rounded-tl-none",
                                msg.isError && "border-destructive/50 bg-destructive/5 text-destructive"
                              )
                        )}
                      >
                        <MarkdownBold text={msg.content} />
                      </div>
                      <span className="text-[10px] text-muted-foreground px-1 uppercase font-medium">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex max-w-[85%] mr-auto items-start gap-1.5"
                    >
                      <div className="p-4 rounded-2xl rounded-tl-none bg-muted border border-border flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">Analysing data...</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="p-4 border-t bg-background shrink-0 pb-safe">
              <div className="flex gap-2 relative">
                <Input
                  placeholder="Ask about your finances..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="bg-muted border-none focus-visible:ring-primary h-12 pr-12 rounded-xl"
                />
                <Button 
                  onClick={handleSend} 
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="absolute right-1 top-1 h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground px-1">
                <span className="flex items-center gap-1.5 font-medium uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Intelligent Assistant
                </span>
                <button 
                  onClick={() => setMessages([messages[0]])}
                  className="flex items-center gap-1 hover:text-foreground transition-colors font-medium uppercase tracking-wider"
                >
                  <RefreshCcw className="w-3 h-3" />
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "pointer-events-auto w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500",
          isOpen 
            ? "bg-background text-foreground border border-border scale-0" 
            : "bg-primary text-primary-foreground"
        )}
      >
        <MessageSquare className="w-6 h-6 fill-current" />
      </motion.button>
    </div>
  );
};

export default Chatbot;
