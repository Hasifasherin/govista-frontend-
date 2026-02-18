"use client";

interface Props {
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  active?: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  name,
  lastMessage,
  time,
  unreadCount,
  active,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer flex justify-between items-center border-b transition ${
        active ? "bg-green-50 border-l-4 border-green-500" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex-1">
        <div className="font-semibold">{name}</div>
        <div className="text-sm text-gray-500 truncate max-w-[160px]">
          {lastMessage}
        </div>
      </div>

      <div className="flex flex-col items-end">
        <span className="text-xs text-gray-400">{time}</span>
        {unreadCount > 0 && (
          <span className="bg-green-600 text-white text-xs rounded-full px-2 mt-1">
            {unreadCount}
          </span>
        )}
      </div>
    </div>
  );
}