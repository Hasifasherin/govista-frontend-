import React, { useState, useRef, useEffect } from 'react';
import { Check, CheckCheck, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';

interface MessageBubbleProps {
  id: string;
  text: string;
  time: string;
  isMe: boolean;
  sender: 'operator' | 'customer';
  isDeleted?: boolean;
  read?: boolean;
  onEdit?: (id: string, newText: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  id,
  text,
  time,
  isMe,
  sender,
  isDeleted = false,
  read = false,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [showOptions, setShowOptions] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = () => {
    if (editText.trim() && editText !== text) {
      onEdit?.(id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(text);
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      return format(new Date(timeStr), 'h:mm a');
    } catch {
      return timeStr;
    }
  };

  if (isDeleted) {
    return (
      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className={`
          max-w-[70%] px-4 py-2 rounded-lg
          ${isMe 
            ? 'bg-gray-200 dark:bg-gray-700' 
            : 'bg-gray-100 dark:bg-gray-800'
          }
          text-gray-500 dark:text-gray-400 italic text-sm
        `}>
          This message was deleted
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2 group`}>
      {/* Avatar for others */}
      {!isMe && (
        <div className="flex-shrink-0 mr-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center text-white text-xs">
            {sender === 'operator' ? 'OP' : 'CU'}
          </div>
        </div>
      )}

      {/* Message content */}
      <div className={`max-w-[70%] ${isMe ? 'order-1' : 'order-2'}`}>
        {/* Sender name for group chats */}
        {!isMe && (
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 mb-1 block">
            {sender === 'operator' ? 'Operator' : 'Customer'}
          </span>
        )}

        {/* Message bubble */}
        <div className="relative group">
          {isEditing ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-500 p-1">
              <input
                ref={editInputRef}
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleEdit}
                className="w-full px-3 py-2 bg-transparent border-none focus:outline-none text-gray-900 dark:text-white"
              />
            </div>
          ) : (
            <div className={`
              relative px-4 py-2 rounded-lg
              ${isMe 
                ? 'bg-blue-500 text-white rounded-br-none' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
              }
            `}>
              <p className="text-sm whitespace-pre-wrap break-words">{text}</p>
              
              {/* Time and read status */}
              <div className={`
                flex items-center justify-end space-x-1 mt-1 text-xs
                ${isMe ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}
              `}>
                <span>{formatTime(time)}</span>
                {isMe && (
                  <span>
                    {read ? (
                      <CheckCheck className="w-4 h-4" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Message actions (Edit/Delete) */}
          {showActions && isMe && !isEditing && (
            <div 
              ref={optionsRef}
              className="absolute top-0 right-0 hidden group-hover:flex -mt-2 -mr-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg"
                title="Edit"
              >
                <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={() => onDelete?.(id)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Spacer for my messages */}
      {isMe && <div className="flex-shrink-0 w-10 ml-2" />}
    </div>
  );
};

export default MessageBubble;