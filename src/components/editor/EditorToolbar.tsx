import { ArrowLeft, Globe, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EditorToolbarProps {
  projectName: string;
  onExport: () => void;
  onShare: () => void;
}

const EditorToolbar = ({ projectName, onExport, onShare }: EditorToolbarProps) => {
  return (
    <header className="h-12 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <span className="text-sm font-medium text-foreground">{projectName}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-xs gap-1.5" onClick={onShare}>
          <Share2 size={14} />
          <span className="hidden sm:inline">Поделиться</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-xs gap-1.5" onClick={onExport}>
          <Download size={14} />
          <span className="hidden sm:inline">ZIP</span>
        </Button>
        <Button size="sm" className="text-xs gap-1.5">
          <Globe size={14} />
          <span className="hidden sm:inline">Опубликовать</span>
        </Button>
      </div>
    </header>
  );
};

export default EditorToolbar;
