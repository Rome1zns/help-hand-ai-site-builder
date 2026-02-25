import { useState, useCallback, useEffect, useRef } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import EditorToolbar from "@/components/editor/EditorToolbar";
import ChatPanel from "@/components/editor/ChatPanel";
import PreviewPanel from "@/components/editor/PreviewPanel";
import FileTreePanel from "@/components/editor/FileTreePanel";
import { streamChat, extractHtmlCode, type Msg } from "@/lib/streamChat";
import { AGENTS, FINAL_AGENT } from "@/lib/agents";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import JSZip from "jszip";

const SESSION_KEY = "helphand_session_id";

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

const Editor = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const agentIndexRef = useRef(0);
  const totalCharsRef = useRef(0);

  // Load conversation history on mount
  useEffect(() => {
    const loadHistory = async () => {
      const sessionId = getSessionId();
      
      // Find existing conversation
      const { data: convos } = await supabase
        .from("conversations")
        .select("id")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (convos && convos.length > 0) {
        const convId = convos[0].id;
        setConversationId(convId);

        const { data: msgs } = await supabase
          .from("chat_messages")
          .select("role, content, agent_name")
          .eq("conversation_id", convId)
          .order("created_at", { ascending: true });

        if (msgs && msgs.length > 0) {
          const restored: Msg[] = msgs.map((m: any) => ({
            role: m.role as Msg["role"],
            content: m.content,
            ...(m.agent_name ? { agent: m.agent_name } : {}),
          }));
          setMessages(restored);

          // Restore last generated code
          const lastAssistant = msgs.filter((m: any) => m.role === "assistant").pop();
          if (lastAssistant) {
            const html = extractHtmlCode(lastAssistant.content);
            if (html) setGeneratedCode(html);
          }
        }
      }
    };
    loadHistory();
  }, []);

  const saveMessage = useCallback(async (convId: string, msg: Msg) => {
    await supabase.from("chat_messages").insert({
      conversation_id: convId,
      role: msg.role,
      content: msg.content,
      agent_name: msg.agent || null,
    });
  }, []);

  const ensureConversation = useCallback(async (): Promise<string> => {
    if (conversationId) return conversationId;
    const sessionId = getSessionId();
    const { data } = await supabase
      .from("conversations")
      .insert({ session_id: sessionId })
      .select("id")
      .single();
    const id = data!.id;
    setConversationId(id);
    return id;
  }, [conversationId]);

  const addAgentMessage = useCallback((agent: typeof AGENTS[0] | typeof FINAL_AGENT) => {
    const msg: Msg = {
      role: "system",
      content: agent.statusMessage,
      agent: agent.name,
      agentColor: agent.textColor,
    };
    setMessages(prev => [...prev, msg]);
    return msg;
  }, []);

  const handleSend = useCallback(
    async (input: string) => {
      const userMsg: Msg = { role: "user", content: input };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      agentIndexRef.current = 0;
      totalCharsRef.current = 0;

      const convId = await ensureConversation();
      await saveMessage(convId, userMsg);

      // Add first agent message immediately
      const firstAgentMsg = addAgentMessage(AGENTS[0]);
      await saveMessage(convId, firstAgentMsg);
      agentIndexRef.current = 1;

      let assistantSoFar = "";
      
      // Estimate ~4000 chars for a typical response
      const estimatedTotal = 4000;

      const upsertAssistant = (chunk: string) => {
        assistantSoFar += chunk;
        totalCharsRef.current += chunk.length;

        // Check if next agent should activate
        const progress = totalCharsRef.current / estimatedTotal;
        const nextIdx = agentIndexRef.current;
        if (nextIdx < AGENTS.length && progress >= AGENTS[nextIdx].threshold) {
          const agentMsg = addAgentMessage(AGENTS[nextIdx]);
          saveMessage(convId, agentMsg);
          agentIndexRef.current = nextIdx + 1;
        }

        // Try to extract and render code as it streams
        const html = extractHtmlCode(assistantSoFar);
        if (html) setGeneratedCode(html);
      };

      try {
        await streamChat({
          messages: [...messages, userMsg],
          onDelta: (chunk) => upsertAssistant(chunk),
          onDone: async () => {
            setIsLoading(false);
            const html = extractHtmlCode(assistantSoFar);
            if (html) setGeneratedCode(html);

            // Save full assistant message (hidden in chat but persisted)
            const assistantMsg: Msg = { role: "assistant", content: assistantSoFar };
            await saveMessage(convId, assistantMsg);

            // Final "done" agent message
            const finalMsg = addAgentMessage(FINAL_AGENT);
            await saveMessage(convId, finalMsg);
          },
        });
      } catch (e) {
        console.error(e);
        setIsLoading(false);
        toast.error(e instanceof Error ? e.message : "Ошибка генерации");
      }
    },
    [messages, ensureConversation, saveMessage, addAgentMessage]
  );

  const handleExport = useCallback(async () => {
    if (!generatedCode) {
      toast.error("Нет кода для экспорта");
      return;
    }
    const zip = new JSZip();
    zip.file("index.html", generatedCode);
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "helphand-project.zip";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Проект экспортирован!");
  }, [generatedCode]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Ссылка скопирована!");
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      <EditorToolbar projectName="Мой проект" onExport={handleExport} onShare={handleShare} />

      <div className="flex-1 hidden md:block">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={25} minSize={18}>
            <ChatPanel messages={messages} isLoading={isLoading} onSend={handleSend} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={55} minSize={30}>
            <PreviewPanel code={generatedCode} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={20} minSize={14}>
            <FileTreePanel hasCode={!!generatedCode} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <MobileTabs
        messages={messages}
        isLoading={isLoading}
        onSend={handleSend}
        generatedCode={generatedCode}
      />
    </div>
  );
};

function MobileTabs({
  messages,
  isLoading,
  onSend,
  generatedCode,
}: {
  messages: Msg[];
  isLoading: boolean;
  onSend: (text: string) => void;
  generatedCode: string;
}) {
  const [tab, setTab] = useState<"chat" | "preview" | "files">("chat");

  return (
    <div className="flex-1 flex flex-col md:hidden">
      <div className="flex border-b border-border bg-card">
        {(["chat", "preview", "files"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              tab === t ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            {t === "chat" ? "Чат" : t === "preview" ? "Превью" : "Файлы"}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        {tab === "chat" && <ChatPanel messages={messages} isLoading={isLoading} onSend={onSend} />}
        {tab === "preview" && <PreviewPanel code={generatedCode} />}
        {tab === "files" && <FileTreePanel hasCode={!!generatedCode} />}
      </div>
    </div>
  );
}

export default Editor;
