import { useState, useCallback } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import EditorToolbar from "@/components/editor/EditorToolbar";
import ChatPanel from "@/components/editor/ChatPanel";
import PreviewPanel from "@/components/editor/PreviewPanel";
import FileTreePanel from "@/components/editor/FileTreePanel";
import { streamChat, extractHtmlCode, type Msg } from "@/lib/streamChat";
import { toast } from "sonner";
import JSZip from "jszip";

const Editor = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  const handleSend = useCallback(
    async (input: string) => {
      const userMsg: Msg = { role: "user", content: input };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      let assistantSoFar = "";
      const upsertAssistant = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });

        // Try to extract and render code as it streams
        const html = extractHtmlCode(assistantSoFar);
        if (html) setGeneratedCode(html);
      };

      try {
        await streamChat({
          messages: [...messages, userMsg],
          onDelta: (chunk) => upsertAssistant(chunk),
          onDone: () => {
            setIsLoading(false);
            // Final extraction
            const html = extractHtmlCode(assistantSoFar);
            if (html) setGeneratedCode(html);
          },
        });
      } catch (e) {
        console.error(e);
        setIsLoading(false);
        toast.error(e instanceof Error ? e.message : "Ошибка генерации");
      }
    },
    [messages]
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

      {/* Desktop: 3-column resizable */}
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

      {/* Mobile: tabs */}
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
