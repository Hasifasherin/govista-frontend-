import React from 'react';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';

interface ChatHeaderProps {
  name: string;
  avatar?: string;
  isOnline?: boolean;
  onBack?: () => void;
  role?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  avatar,
  isOnline,
  onBack,
  role
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        {/* Back button for mobile */}
        {onBack && (
          <button 
            onClick={onBack}
            className="md:hidden p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
            {avatar ? (
              <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />
            ) : (
              name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            )}
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
          )}
        </div>
        
        {/* User info */}
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">{name}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isOnline ? 'Online' : 'Offline'}
            {role && ` • ${role}`}
          </p>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <Phone className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <Video className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;