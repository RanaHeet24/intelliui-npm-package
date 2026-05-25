import React from 'react';
import { MessageRenderer } from '../renderers/MessageRenderer';
import type { ChatMessage } from '../types';

export interface MessageProps {
  message: ChatMessage;
}

/**
 * Message bubble container.
 * Delegates actual content parsing and syntax highlighting rendering to MessageRenderer.
 */
export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
      <div
        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm md:text-base shadow-sm ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 rounded-bl-sm overflow-x-auto'
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
        ) : (
          <MessageRenderer message={message} />
        )}
      </div>
    </div>
  );
}
