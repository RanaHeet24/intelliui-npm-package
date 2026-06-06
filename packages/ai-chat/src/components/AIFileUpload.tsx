import React from "react";
import { AIFileAttachment } from "../types/file";

export interface AIFileUploadProps {
  files: AIFileAttachment[];
  className?: string;
}

/**
 * Reusable primitive for rendering uploaded files list.
 */
export const AIFileUpload: React.FC<AIFileUploadProps> = ({ files, className = "" }) => {
  if (!files || files.length === 0) return null;

  const formatSize = (bytes?: number) => {
    if (!bytes) return "";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className={`ai-file-uploads mt-3 flex flex-col gap-2 ${className}`}>
      {files.map((file) => (
        <div 
          key={file.id} 
          className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors text-xs shadow-xs"
        >
          {/* File Icon placeholder */}
          <div className="flex-shrink-0 w-8.5 h-8.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-[9px] border border-zinc-200/50 dark:border-zinc-700/50">
            {file.type.split("/")[1]?.toUpperCase() || file.type.slice(0, 3).toUpperCase()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
              {file.name}
            </div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">
              {file.type} {file.size ? `• ${formatSize(file.size)}` : ""}
            </div>
          </div>

          <div className="flex-shrink-0 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider select-none border border-emerald-500/20 dark:border-emerald-400/20">
            Uploaded
          </div>
        </div>
      ))}
    </div>
  );
};
