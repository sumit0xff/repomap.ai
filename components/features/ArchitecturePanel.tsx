"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Maximize2, Copy, Download, ZoomIn, ZoomOut, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArchitecturePanelProps {
  diagram: string;
}

export default function ArchitecturePanel({ diagram }: ArchitecturePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "var(--font-sans)",
      themeVariables: {
        primaryColor: "#111113",
        primaryTextColor: "#fff",
        primaryBorderColor: "rgba(255,255,255,0.2)",
        lineColor: "rgba(255,255,255,0.4)",
        secondaryColor: "#4d4da8",
        tertiaryColor: "#09090B",
      }
    });

    const renderDiagram = async () => {
      try {
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, diagram);
        setSvgContent(svg);
      } catch (err) {
        console.error("Mermaid parsing error:", err);
        setSvgContent("<div class='text-red-400 p-4'>Failed to render architecture diagram. Invalid syntax.</div>");
      }
    };

    if (diagram) {
      renderDiagram();
    }
  }, [diagram]);

  const handleCopy = () => {
    navigator.clipboard.writeText(diagram);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "architecture.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={cn(
      "flex flex-col bg-[#111113] border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300",
      isFullscreen ? "fixed inset-4 z-50 shadow-2xl" : "relative w-full"
    )}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-black/20">
        <h3 className="text-sm font-medium text-white/90">Architecture Flow</h3>
        <div className="flex items-center gap-1">
          <button aria-label="Zoom out" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1.5 text-white/50 hover:text-white transition-colors rounded-md hover:bg-white/5">
            <ZoomOut size={16} />
          </button>
          <button aria-label="Zoom in" onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-1.5 text-white/50 hover:text-white transition-colors rounded-md hover:bg-white/5">
            <ZoomIn size={16} />
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-1" />
          <button aria-label="Copy Mermaid" onClick={handleCopy} className="p-1.5 text-white/50 hover:text-white transition-colors rounded-md hover:bg-white/5 flex items-center gap-1" title="Copy Source">
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            {copied && <span className="text-xs text-green-400 pr-1">Copied</span>}
          </button>
          <button aria-label="Export Markdown" onClick={handleExport} className="p-1.5 text-white/50 hover:text-white transition-colors rounded-md hover:bg-white/5" title="Export SVG">
            <Download size={16} />
          </button>
          <button aria-label="Toggle Fullscreen" onClick={() => setIsFullscreen(!isFullscreen)} className="p-1.5 text-white/50 hover:text-white transition-colors rounded-md hover:bg-white/5 ml-1" title="Toggle Fullscreen">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="relative flex-1 overflow-auto bg-[#09090B] p-8 flex items-center justify-center min-h-[300px]">
        <div 
          ref={containerRef}
          className="transition-transform duration-200 origin-center"
          style={{ transform: `scale(${zoom})` }}
          dangerouslySetInnerHTML={{ __html: svgContent }} 
        />
      </div>
    </div>
  );
}
