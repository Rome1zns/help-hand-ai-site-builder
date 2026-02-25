import { useState, useRef, useEffect } from "react";
import { Send, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { AGENTS, FINAL_AGENT } from "@/lib/agents";
import type { Msg } from "@/lib/streamChat";

interface ChatPanelProps {
  messages: Msg[];
  isLoading: boolean;
  onSend: (text: string) => void;
}

const AgentAvatar = ({ agent, color, Icon }: { agent: string; color: string; Icon: any }) => (
  <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center shrink-0 mt-0.5`}>
    <Icon size={14} />
  </div>
);

const ChatPanel = ({ messages, isLoading, onSend }: ChatPanelProps) => {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput("");
  };

  const getAgentInfo = (msg: Msg) => {
    if (msg.agent) {
      const found = AGENTS.find(a => a.name === msg.agent);
      if (found) return found;
      if (msg.agent === FINAL_AGENT.name) return FINAL_AGENT;
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header with agent avatars */}
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground mb-2">Команда ИИ-агентов</h2>
        <div className="flex gap-1.5">
          {AGENTS.map((agent) => (
            <div key={agent.name} className="flex items-center gap-1">
              <div className={`w-5 h-5 rounded-md ${agent.color} flex items-center justify-center`}>
                <agent.icon size={10} className={agent.textColor} />
              </div>
              <span className={`text-[10px] ${agent.textColor}`}>{agent.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center px-4">
            <div className="flex gap-2 mb-4">
              {AGENTS.map((agent) => (
                <div key={agent.name} className={`w-10 h-10 rounded-xl ${agent.color} flex items-center justify-center`}>
                  <agent.icon size={20} className={agent.textColor} />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-foreground">Команда из 4 ИИ-агентов</p>
            <p className="text-xs mt-1">готова создать ваш сайт</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const agentInfo = getAgentInfo(msg);

            // System messages (agent status)
            if (msg.role === "system" && agentInfo) {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-2.5"
                >
                  <AgentAvatar agent={agentInfo.name} color={agentInfo.color} Icon={agentInfo.icon} />
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-semibold ${agentInfo.textColor} mb-0.5`}>
                      {agentInfo.name}
                    </span>
                    <div className="bg-secondary/50 rounded-xl px-3 py-2 text-xs text-muted-foreground italic">
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              );
            }

            // User messages
            if (msg.role === "user") {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5 justify-end"
                >
                  <div className="max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed bg-primary text-primary-foreground">
                    {msg.content}
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <User size={14} className="text-muted-foreground" />
                  </div>
                </motion.div>
              );
            }

            // Assistant messages (hidden — replaced by agent statuses)
            return null;
          })}
        </AnimatePresence>

        {isLoading && !messages.some(m => m.role === "system") && (() => {
          const FirstIcon = AGENTS[0].icon;
          return (
            <div className="flex gap-2.5">
              <div className={`w-7 h-7 rounded-lg ${AGENTS[0].color} flex items-center justify-center shrink-0`}>
                <FirstIcon size={14} className={AGENTS[0].textColor} />
              </div>
              <div className="bg-secondary rounded-xl px-3.5 py-2.5">
                <Loader2 size={14} className="animate-spin text-muted-foreground" />
              </div>
            </div>
          );
        })()}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-border">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Опишите сайт..."
            disabled={isLoading}
            className="flex-1 bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary/50 transition-colors"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="shrink-0 rounded-lg">
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;
