import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { analyzeSmartContract } from '../api/gemini3';

interface Message {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const SmartContractChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('SmartContractChatbot mounted');
    // Add initial welcome message
    setMessages([{
      type: 'bot',
      content: 'Hello! I\'m your Smart Contract Assistant. How can I help you today?',
      timestamp: new Date()
    }]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await analyzeSmartContract(userMessage.content);
      const botMessage: Message = {
        type: 'bot',
        content: response.answer,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        type: 'bot',
        content: 'Sorry, I encountered an error while processing your question. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div 
      className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg border border-gray-200"
      role="region"
      aria-label="Smart Contract Assistant Chat Interface"
    >
      <div 
        className="bg-blue-600 p-4 rounded-t-lg"
        role="banner"
      >
        <div className="flex items-center gap-2 text-white">
          <Bot className="w-6 h-6" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Smart Contract Assistant</h2>
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.type === 'user' ? 'flex-row-reverse' : ''
            }`}
            role="article"
            aria-label={`${message.type === 'user' ? 'Your message' : 'Assistant response'}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-blue-600'
              }`}
              aria-hidden="true"
            >
              {message.type === 'user' ? (
                <User className="w-5 h-5" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
            </div>
            <div
              className={`flex-1 rounded-lg p-4 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">
                  {message.type === 'user' ? 'You' : 'Assistant'}
                </span>
                <span className={`text-sm ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div 
            className="flex items-center gap-3"
            role="status"
            aria-label="Loading response"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 text-blue-600 flex items-center justify-center">
              <Bot className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex-1 rounded-lg p-4 bg-white border border-gray-200">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="p-4 border-t border-gray-200 bg-white"
        role="form"
        aria-label="Chat message form"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about smart contracts..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
            aria-label="Message input"
            role="textbox"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SmartContractChatbot; 