"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useAdaptiveLayout } from '../layout';

export interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (attachedFiles?: any[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "Message IntelliUI...",
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const { mode } = useAdaptiveLayout();

  const isCompact = mode === "widget" || mode === "mobile" || mode === "drawer";

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && (value.trim() || attachedFile)) {
        handleSend();
      }
    }
  };

  const handleSend = () => {
    const filesMetadata = attachedFile ? [{
      id: Math.random().toString(36).substring(7),
      name: attachedFile.name,
      type: attachedFile.type || "application/octet-stream",
      size: attachedFile.size,
      url: "#"
    }] : undefined;
    
    onSubmit(filesMetadata);
    setAttachedFile(null);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const removeFile = () => {
    setAttachedFile(null);
  };

  const formatSize = (bytes: number) => {
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {/* File Attachment Preview */}
      {attachedFile && (
        <div className={`flex items-center justify-between gap-3 self-start rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
          isCompact ? "px-2 py-1.5 rounded-xl gap-2" : "px-3.5 py-2"
        }`}>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-zinc-550 dark:text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="flex flex-col min-w-0">
              <span className={`font-bold text-zinc-800 dark:text-zinc-200 truncate ${
                isCompact ? "text-[10px] max-w-[120px]" : "text-[11px] max-w-[180px]"
              }`}>{attachedFile.name}</span>
              <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono truncate">{attachedFile.type || "binary"} • {formatSize(attachedFile.size)}</span>
            </div>
          </div>
          <button 
            onClick={removeFile}
            className="rounded-full p-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Main Floating Capsule Input Dock */}
      <div className={`relative flex w-full items-end rounded-2xl border border-zinc-200/50 dark:border-zinc-850/40 bg-white/80 dark:bg-zinc-900/40 backdrop-blur-md shadow-xs transition-all duration-300 vfx-input-halo ${
        isCompact ? "p-1.5 gap-1 rounded-xl" : "p-2.5 gap-2"
      }`}>
        {/* Hidden File Input */}
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Paperclip upload button */}
        <button
          onClick={triggerFileSelect}
          disabled={disabled}
          type="button"
          className={`mb-0.5 flex shrink-0 items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-850 dark:hover:text-zinc-200 hover:bg-zinc-100/55 dark:hover:bg-zinc-800/40 transition-all disabled:opacity-40 ${
            isCompact ? "h-8 w-8 ml-0.5 rounded-lg" : "h-9.5 w-9.5 ml-1"
          }`}
          title="Upload file (PDF/CSV/PNG)"
        >
          <svg className="w-4.5 h-4.5 rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={isCompact ? "Message..." : placeholder}
          className={`max-h-48 resize-none bg-transparent px-2 focus:outline-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-550 disabled:opacity-45 leading-relaxed ${
            isCompact ? "min-h-[30px] text-[13px] py-1" : "min-h-[38px] text-[14px] py-2"
          }`}
          rows={1}
        />

        {/* Submit Send Button */}
        <button
          onClick={handleSend}
          disabled={disabled || (!value.trim() && !attachedFile)}
          className={`mb-0.5 flex shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-55 dark:text-zinc-950 transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:bg-zinc-100 disabled:text-zinc-350 dark:disabled:bg-zinc-800/45 dark:disabled:text-zinc-700 cursor-pointer active:scale-95 ${
            isCompact ? "h-8 w-8 mr-0.5 rounded-lg" : "h-9.5 w-9.5 mr-1"
          }`}
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4.5 w-4.5 ml-0.5 shrink-0"
          >
            <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
