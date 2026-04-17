import React from 'react';
import { Sparkles, User } from 'lucide-react';
import Markdown from 'react-markdown';

const MessageBubble = ({ message }) => {
  const isAI = message.role === 'ai';

  if (isAI) {
    return (
      <div className="flex flex-col items-start gap-1 sm:gap-2 mb-6 max-w-[85%] sm:max-w-3xl w-full">
        <div className="flex items-center gap-2 pl-2 mb-1">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-[0_0_10px_rgba(124,58,237,0.4)]">
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" />
          </div>
          <span className="text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors">DevMentor AI</span>
          <span className="text-[10px] sm:text-xs text-gray-500">{message.timestamp}</span>
        </div>
        <div className="bg-white dark:bg-[#121215] border border-purple-500/10 shadow-[0_4px_20px_-4px_rgba(124,58,237,0.15)] rounded-2xl rounded-tl-sm px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-800 dark:text-gray-200 transition-colors leading-relaxed font-light prose dark:prose-invert max-w-full break-words overflow-hidden prose-p:leading-relaxed prose-pre:bg-gray-100 dark:prose-pre:bg-[#0a0a0f] prose-pre:text-gray-900 dark:prose-pre:text-gray-100 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-800 prose-code:text-indigo-600 dark:prose-code:text-purple-400 prose-code:before:content-none prose-code:after:content-none">
          <Markdown>{message.content}</Markdown>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1 sm:gap-2 mb-6 w-full ml-auto max-w-[85%] sm:max-w-3xl">
      <div className="flex items-center gap-2 pr-2 mb-1">
        <span className="text-[10px] sm:text-xs text-gray-500">{message.timestamp}</span>
        <span className="text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors">You</span>
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center transition-colors">
          <User className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gray-600 dark:text-gray-400 transition-colors" />
        </div>
      </div>
      <div className="bg-gray-100 dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-700/50 shadow-md rounded-2xl rounded-tr-sm px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-800 dark:text-gray-200 transition-colors leading-relaxed font-light whitespace-pre-wrap break-words overflow-hidden max-w-full">
        {message.content}
      </div>
    </div>
  );
};

export default MessageBubble;
