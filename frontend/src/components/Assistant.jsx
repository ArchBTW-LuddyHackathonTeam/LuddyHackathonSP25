import React, { useEffect, useRef, useCallback, memo } from 'react';
import { Bot, Send, PenTool } from 'lucide-react';
import { useAssistant } from '../services/AssistantContext';

// Separate message component to prevent re-rendering all messages
const Message = memo(({ message }) => (
  <div 
    className={`flex ${message.sender === 'assistant' ? 'justify-start' : 'justify-end'}`}
  >
    <div 
      className={`px-4 py-3 rounded-lg max-w-xl ${
        message.sender === 'assistant' 
          ? 'bg-white border border-gray-200 text-gray-700 shadow-sm' 
          : 'bg-blue-500 text-white'
      }`}
    >
      {message.sender === 'assistant' && (
        <div className="flex items-center mb-1">
          <Bot size={16} className="mr-2 text-blue-500" />
          <span className="font-medium text-sm text-blue-600">Degree Assistant</span>
        </div>
      )}
      <p className="whitespace-pre-wrap">{message.content}</p>
      <div className={`text-xs mt-1 text-right ${
        message.sender === 'assistant' ? 'text-gray-400' : 'text-blue-200'
      }`}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  </div>
));

// Separate input component to isolate re-renders
const MessageInput = memo(({ 
  userMessage, 
  setUserMessage, 
  handleSendMessage, 
  isAssistantTyping 
}) => (
  <div className="flex items-end">
    <div className="flex-grow relative">
      <textarea
        placeholder="Ask me about your degree plan, course recommendations, or requirements..."
        className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        rows={3}
      />
      <div className="absolute right-3 bottom-3 text-gray-400">
        <PenTool size={18} />
      </div>
    </div>
    <button
      className="ml-2 px-4 py-3 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      onClick={handleSendMessage}
      disabled={!userMessage.trim() || isAssistantTyping}
    >
      <Send size={20} />
    </button>
  </div>
));

// Suggestion buttons component
const SuggestionButtons = memo(({ setUserMessage }) => (
  <div className="mt-3 flex justify-center">
    <div className="flex flex-wrap gap-2 text-xs text-center max-w-lg">
      <button 
        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
        onClick={() => setUserMessage("Can you recommend some courses to fulfill my Arts and Humanities requirement?")}
      >
        Course recommendations
      </button>
      <button 
        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
        onClick={() => setUserMessage("What's the difference between the Software Engineering and Systems specializations?")}
      >
        Specialization differences
      </button>
      <button 
        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
        onClick={() => setUserMessage("How am I doing overall with my degree progress?")}
      >
        Check my progress
      </button>
      <button 
        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
        onClick={() => setUserMessage("Which courses are the most challenging in my remaining requirements?")}
      >
        Difficult courses
      </button>
    </div>
  </div>
));

const Assistant = ({
  assistantMessages,
  isAssistantTyping,
  userMessage,
  setUserMessage
}) => {
  const messagesEndRef = useRef(null);
  const { sendMessageWithUserData } = useAssistant();

  // Memoize the send message handler
  const handleSendMessage = useCallback(() => {
    if (!userMessage.trim() || isAssistantTyping) return;
    sendMessageWithUserData(userMessage);
    setUserMessage('');
  }, [userMessage, isAssistantTyping, sendMessageWithUserData, setUserMessage]);

  // Optimize scroll effect to only run when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [assistantMessages.length]); // Only depend on message count instead of the entire array

  return (
    <div className="flex flex-col h-full">
      {/* Messages container */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-4">
          {assistantMessages.map((message, index) => (
            <Message key={index} message={message} />
          ))}

          {isAssistantTyping && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-lg bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center mb-1">
                  <Bot size={16} className="mr-2 text-blue-500" />
                  <span className="font-medium text-sm text-blue-600">Degree Assistant</span>
                </div>
                <div className="flex space-x-1 h-6 items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto">
          <MessageInput
            userMessage={userMessage}
            setUserMessage={setUserMessage}
            handleSendMessage={handleSendMessage}
            isAssistantTyping={isAssistantTyping}
          />
          
          <SuggestionButtons setUserMessage={setUserMessage} />
        </div>
      </div>
    </div>
  );
};

export default Assistant;