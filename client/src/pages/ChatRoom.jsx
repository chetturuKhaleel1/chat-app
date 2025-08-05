import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import Directorypane from "../components/Directorypane"; // ✅ small `p`
import socket from "../socket";

export default function ChatRoom() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");
  const room = searchParams.get("room");

  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    if (username && room) {
      if (!socket.connected) socket.connect();

      // Get current socket ID
      socket.on("connect", () => {
        setCurrentUserId(socket.id);
      });

      socket.emit("join-room", { username, room });

      socket.on("receive-message", (data) => {
        setChat((prev) => [...prev, data]);
      });

      socket.on("receive-private-message", (data) => {
        setChat((prev) => [
          ...prev,
          { ...data, text: `🔒 (Private) ${data.text}` },
        ]);
      });

      socket.on("user-list", (data) => {
        setUsers(data);
      });

      socket.on("user-typing", (user) => {
        if (user !== username) {
          setTypingStatus(`${user} is typing...`);
          setTimeout(() => setTypingStatus(""), 2000);
        }
      });
    }

    return () => {
      socket.off("connect");
      socket.off("receive-message");
      socket.off("receive-private-message");
      socket.off("user-list");
      socket.off("user-typing");
      socket.disconnect();
    };
  }, [username, room]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = () => {
    if (message.trim()) {
     socket.emit("send-message", {
  username,
  text: message,
  room,
  time: new Date().toLocaleTimeString()
});

      setMessage("");
    }
  };

  const handleTyping = () => {
    socket.emit("typing", username);
  };

  const sendPrivateMessage = (toSocketId) => {
    if (message.trim() && toSocketId) {
      socket.emit("private-message", {
        toSocketId,
        text: message,
      });

      setChat((prev) => [
        ...prev,
        {
          sender: `To (${toSocketId})`,
          text: `🔒 (Private) ${message}`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
      setMessage("");
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <ChatWindow
        chat={chat}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        bottomRef={bottomRef}
        room={room}
        username={username}
        typingStatus={typingStatus}
        onTyping={handleTyping}
      />
      <Directorypane
        users={users}
        onPrivateMessage={sendPrivateMessage}
        currentUserId={currentUserId}
      />
    </div>
  );
}
