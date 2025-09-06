import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

export default function Login() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [newRoom, setNewRoom] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected with id:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    // Request list from server
    socket.emit("get-room-list");

    // Listen for the list
    socket.on("room-list", (data) => {
      console.log("Received room list from server:", data);
      setRoomList(data);
    });

    return () => {
      socket.off("room-list");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  const handleJoin = () => {
    // Validation for empty username
    if (!username.trim()) {
      alert("Please enter a username.");
      return;
    }

    // Validation for empty room
    if (!room.trim()) {
      alert("Please select a room.");
      return;
    }

    // Clear previous listeners to avoid duplication
    socket.off("user-list");
    socket.off("error-message");

    // Handle error from server (e.g., duplicate username)
    const onError = (msg) => {
      alert(msg);
      cleanup();
    };

    // Handle success (navigate to chat)
    const onSuccess = () => {
      cleanup();
      navigate(`/chat?username=${username}&room=${room}`);
    };

    // Cleanup listeners
    const cleanup = () => {
      socket.off("error-message", onError);
      socket.off("user-list", onSuccess);
    };

    // Set up listeners
    socket.once("error-message", onError);
    socket.once("user-list", onSuccess);

    // Emit join request
    socket.emit("join-room", { username: username.trim(), room: room.trim() });
  };

  const createRoom = () => {
    if (newRoom.trim()) {
      socket.emit("create-room", newRoom.trim());
      setNewRoom("");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Join a Chat Room</h2>

        <input
          type="text"
          placeholder="Enter username"
          className="w-full p-2 mb-3 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="mb-4">
          <select
            className="w-full p-2 mb-2 border rounded text-black bg-white"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          >
            <option value="" className="text-black bg-white">
              Select a Room
            </option>
            {roomList.map((r) => (
              <option key={r.name} value={r.name} className="text-black bg-white">
                {r.name} — {r.description}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Create new room"
              className="w-full p-2 border rounded"
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
            />
            <button
              onClick={createRoom}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              +
            </button>
          </div>
        </div>

        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={handleJoin}
        >
          Join
        </button>
      </div>
    </div>
  );
}
