import { useEffect, useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function ChatInterface({ messages, input, setInput, onSendMessage, loading, disabled }) {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const formatMessage = (content) => {
    // Basic formatting for code blocks and line breaks
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}
          >
            <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                message.role === 'user' 
                  ? 'bg-blue-500 text-white ml-2' 
                  : 'bg-gray-200 text-gray-700 mr-2'
              }`}>
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              
              {/* Message Bubble */}
              <div className={`chat-bubble ${message.role === 'user' ? 'user' : 'assistant'}`}>
                <div className="text-sm leading-relaxed">
                  {formatMessage(message.content)}
                </div>
                <div className={`text-xs mt-1 opacity-70 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-start animate-slideUp">
            <div className="flex items-end space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                🤖
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <LoadingSpinner size="sm" />
                <span className="text-sm text-gray-500 ml-2">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!disabled && (
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder="Type your response here... (Press Enter to send, Shift+Enter for new line)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                rows="1"
                style={{ 
                  minHeight: '48px', 
                  maxHeight: '120px',
                  overflow: 'auto'
                }}
              />
            </div>
            <button
              onClick={onSendMessage}
              disabled={loading || !input.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors duration-200 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>{input.length}/1000</span>
          </div>
        </div>
      )}
    </div>
  );
}
