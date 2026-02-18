import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, Mic } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type a message..."
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Fixed: Added null initial value

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null; // Reset to null after clearing
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      typingTimeoutRef.current = null; // Reset to null after execution
    }, 1000);
  };

  return (
    <div className="flex items-center px-4 py-3 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <button 
        className="p-2 mr-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        disabled={disabled}
      >
        <Paperclip className="w-5 h-5" />
      </button>

      <button 
        className="p-2 mr-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        disabled={disabled}
      >
        <Smile className="w-5 h-5" />
      </button>

      <div className="flex-1 mx-2">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <button 
        className="p-2 mr-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors md:block hidden"
        disabled={disabled}
      >
        <Mic className="w-5 h-5" />
      </button>

      <button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className={`
          p-2 rounded-full transition-colors
          ${message.trim() && !disabled
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }
        `}
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};

export default MessageInput;