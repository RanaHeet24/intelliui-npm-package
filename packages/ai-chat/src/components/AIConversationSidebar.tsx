import React, { useState } from "react";
import { useAdaptiveLayout } from "../layout";

export interface ConversationItem {
  id: string;
  title: string;
  updatedAt?: string | Date;
}

export interface AIConversationSidebarProps {
  conversations: ConversationItem[];
  activeId?: string;
  onSelectConversation?: (id: string) => void;
  onNewConversation?: () => void;
  onRenameConversation?: (id: string, newTitle: string) => void;
  onDeleteConversation?: (id: string) => void;
  className?: string;
}

/**
 * Premium Conversational Thread History Sidebar.
 * Highly visual design complete with elegant neon active indicators.
 */
export const AIConversationSidebar: React.FC<AIConversationSidebarProps> = ({
  conversations,
  activeId,
  onSelectConversation,
  onNewConversation,
  onRenameConversation,
  onDeleteConversation,
  className = "",
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const { mode, sidebarCollapsed, setSidebarCollapsed } = useAdaptiveLayout();

  const isSidebarOpen = !sidebarCollapsed;

  const startEditing = (e: React.MouseEvent, chat: ConversationItem) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditValue(chat.title);
  };

  const handleRenameSubmit = (id: string) => {
    if (editValue.trim() && onRenameConversation) {
      onRenameConversation(id, editValue.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      handleRenameSubmit(id);
    } else if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  return (
    <aside className={`ai-conversation-sidebar w-64 flex-shrink-0 flex flex-col h-full bg-[#0a0a0f] border-r border-zinc-900 select-none ${
      isSidebarOpen ? "sidebar-open" : ""
    } ${className}`}>
      {/* New Conversation Button */}
      <div className="p-4">
        <button
          onClick={() => {
            onNewConversation?.();
            if (mode !== "workspace") {
              setSidebarCollapsed(true);
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-150 text-zinc-950 font-bold text-xs transition-all shadow-[0_4px_20px_rgba(255,255,255,0.08)] cursor-pointer active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Thread list area */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-1.5">
        <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold px-2.5 py-2 font-mono flex items-center justify-between">
          <span>History</span>
          {mode !== "workspace" && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {conversations.length === 0 ? (
          <div className="px-2.5 py-4 text-xs text-zinc-500 italic font-mono">
            No active threads
          </div>
        ) : (
          conversations.map((chat) => {
            const isActive = chat.id === activeId;
            const isEditing = chat.id === editingId;

            return (
              <div
                key={chat.id}
                onClick={() => !isEditing && onSelectConversation?.(chat.id)}
                className={`group relative w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-semibold transition-all select-none border ${
                  isActive
                    ? "bg-[#181824]/90 border-violet-500/20 text-white shadow-[0_0_15px_rgba(139,92,246,0.08)]"
                    : "border-transparent text-zinc-400 hover:bg-[#12121a]/80 hover:text-zinc-100 cursor-pointer"
                }`}
              >
                {isEditing ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleRenameSubmit(chat.id)}
                    onKeyDown={(e) => handleKeyDown(e, chat.id)}
                    className="w-full bg-[#181824] border border-zinc-800 px-2 py-1 rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    {/* Glowing dot for active chat */}
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    )}
                    
                    <span className="truncate flex-1 pr-6 text-[13px] leading-relaxed">
                      {chat.title || "Untitled Chat"}
                    </span>

                    {/* Action buttons revealed on item hover */}
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Rename Trigger */}
                      <button
                        onClick={(e) => startEditing(e, chat)}
                        className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                        title="Rename Chat"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>

                      {/* Delete Trigger */}
                      {onDeleteConversation && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(chat.id);
                          }}
                          className="p-1 rounded-md hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
                          title="Delete Chat"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
