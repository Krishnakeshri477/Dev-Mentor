import React, { useState, useRef, useEffect, useContext } from 'react';
import { Search, Bell, Share, Paperclip, Mic, Send } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { AuthContext } from '../context/AuthContext';
import { getChatHistory, sendMessage } from '../api/chat';

const ChatWindow = ({ onRequiresLogin }) => {
  const { user, token } = useContext(AuthContext);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      content: "Hello! I am DevMentor AI. What are we working on today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [insights, setInsights] = useState([]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user || !token) return;
        try {
          const data = await getChatHistory();
          if (data.interactions) {
            const loadedMessages = [];
            
            data.interactions.forEach(item => {
              loadedMessages.push({
                id: item._id + '-user',
                role: 'user',
                content: item.query,
                timestamp: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              });
              loadedMessages.push({
                id: item._id + '-ai',
                role: 'ai',
                content: item.aiResponse,
                timestamp: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              });
            });
            
            setMessages(loadedMessages);
          }
        } catch (err) {
          console.error("Failed to load chat history", err);
        }
    };
    
    fetchHistory();
  }, [user, token]);

  const handleSend = async () => {
    if (!user) {
      onRequiresLogin();
      return;
    }
    if (!inputText.trim() || isLoading) return;

    const newUserMsg = {
      id: Date.now(),
      role: 'user',
      content: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const result = await sendMessage(newUserMsg.content);
      const aiContent = result.data?.aiResponse || "Sorry, I couldn't process that.";
      const weaknesses = result.data?.identifiedWeakSpots || [];

      if (weaknesses.length > 0) {
        setInsights(weaknesses);
      }

      const newAiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: aiContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, newAiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        content: "Error connecting to the DevMentor AI backend. Make sure the server is running on port 5000.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-[#050505] relative overflow-hidden transition-colors duration-200">
      {/* Top Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-32 bg-purple-600/10 rounded-[100%] blur-[80px] pointer-events-none"></div>

      {/* Top Header */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200 dark:border-gray-800/50 transition-colors backdrop-blur-sm z-10 shrink-0">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors font-display">Chat Session</h2>
          <div className="flex items-center gap-2 mt-1">
             <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isLoading ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLoading ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span className={`text-xs font-medium tracking-wide uppercase ${isLoading ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isLoading ? 'AI Thinking...' : 'Ready'}
            </span>
          </div>
        </div>
      </header>

      {/* Scrollable Message Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-8 py-6 z-10 custom-scrollbar pb-32 sm:pb-36 transition-all duration-300">
        <div className="max-w-4xl mx-auto flex flex-col w-full">
          
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Sticky Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-gray-50 via-gray-50 dark:from-[#050505] dark:via-[#050505] to-transparent z-20 transition-colors duration-200">
        <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-3 bg-white dark:bg-[#121215] border border-gray-200 dark:border-gray-700/50 rounded-full p-1.5 sm:p-2 pl-3 sm:pl-4 pr-1.5 sm:pr-3 shadow-lg dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] focus-within:border-purple-500/50 focus-within:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all duration-300">
          <button className="hidden sm:block p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            placeholder={user ? "Ask DevMentor AI..." : "Login to chat..."} 
            className="flex-1 bg-transparent text-gray-900 dark:text-gray-200 transition-colors placeholder-gray-500 text-sm focus:outline-none p-2 font-light disabled:opacity-50"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            readOnly={!user}
            onClick={() => !user && onRequiresLogin()}
            disabled={isLoading}
          />
          <button onClick={() => !user && onRequiresLogin()} className="hidden sm:block p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors">
            <Mic className="w-5 h-5" />
          </button>
          <button 
            onClick={!user ? onRequiresLogin : handleSend}
            disabled={isLoading || (user && !inputText.trim())}
            className="p-2 sm:p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
