import MessageBubble from "./MessageBubble";
import { useEffect, useRef } from "react";

export default function ChatWindow({
  chat,
  username,
  message,
  setMessage,
  sendMessage,
  typingStatus,
  onTyping
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="flex-1 flex flex-col bg-blue-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow text-blue-800 font-semibold text-lg">
        Chat Room
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
        {chat.map((msg, index) => (
          <MessageBubble
            key={index}
            sender={msg.sender}
            text={msg.text}
            time={msg.time}
            isSelf={msg.sender === username}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Typing indicator */}
      {typingStatus && (
        <div className="text-xs text-gray-500 px-6">{typingStatus}</div>
      )}

      {/* Message Input */}
      <div className="bg-white px-4 py-3 flex gap-2 border-t shadow-sm">
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            onTyping();
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
