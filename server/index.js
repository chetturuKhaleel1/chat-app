import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

// App Setup
const app = express();
app.use(cors());
app.get("/", (req, res) => {
  res.send("✅ Chat backend is running.");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://chat-fk3z895x5-chetturu-khaleels-projects.vercel.app",
      "https://chat-deul5ann2-chetturu-khaleels-projects.vercel.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST"],
  },
});




// ------------------- ROOM & USERS SETUP -------------------
const rooms = [
  { name: "general", description: "Talk about anything" },
  { name: "tech", description: "Discuss coding and tech news" },
  { name: "fun", description: "Share memes and jokes" },
  { name: "study", description: "Study rooms and resources" },
  { name: "random", description: "Off-topic conversations" },
];

// Tracks real users per room
const roomUsers = {
  general: [],
  tech: [],
  fun: [],
  study: [],
  random: [],
};

// Default fake users for general room UI
const defaultGeneralUsers = [
  { id: "guest1", username: "Alice" },
  { id: "guest2", username: "Bob" },
  { id: "guest3", username: "Charlie" },
  { id: "guest4", username: "Dave" },
];

// ------------------- SOCKET HANDLERS -------------------
io.on("connection", (socket) => {
  console.log("✅ User connected");

  // Send room list on first connect
  socket.emit("room-list", rooms);

  // Handle explicit request from client
  socket.on("get-room-list", () => {
    socket.emit("room-list", rooms);
  });

  // 🔹 User joins room
  socket.on("join-room", ({ username, room }) => {
    if (!roomUsers[room]) roomUsers[room] = [];

    const isDuplicateRealUser = roomUsers[room].some(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    const isFakeConflict =
      room === "general" &&
      defaultGeneralUsers.some(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      );

    if (isDuplicateRealUser || isFakeConflict) {
      socket.emit("error-message", "Username already taken in this room.");
      return;
    }

    socket.join(room);
    socket.data.username = username;
    socket.data.room = room;

    const currentUser = { id: socket.id, username };
    roomUsers[room].push(currentUser);

    // ✅ Let frontend know join was successful
    socket.emit("join-success");

    let usersToSend = [...roomUsers[room]];
    if (room === "general") {
      usersToSend = [...defaultGeneralUsers, ...roomUsers[room]];
    }

    io.to(room).emit("user-list", usersToSend);

    io.to(room).emit("receive-message", {
      sender: "System",
      text: `${username} joined the room.`,
      time: new Date().toLocaleTimeString(),
    });
  });

  // 🔹 Private message
  socket.on("private-message", ({ toSocketId, text }) => {
    if (toSocketId.startsWith("guest")) return; // UI-only users
    const msg = {
      sender: socket.data.username,
      text,
      time: new Date().toLocaleTimeString(),
      private: true,
    };
    io.to(toSocketId).emit("receive-private-message", msg);
  });

  // 🔹 Create room
  socket.on("create-room", (newRoomName) => {
    const name = newRoomName.trim().toLowerCase();
    if (!rooms.some((r) => r.name === name)) {
      const newRoom = { name, description: "New chat room" };
      rooms.push(newRoom);
      roomUsers[name] = [];
      io.emit("room-list", rooms);
    }
  });

  // 🔹 Public message
  socket.on("send-message", ({ username, text, room, time }) => {
    const message = {
      sender: username,
      text,
      time,
    };
    io.to(room).emit("receive-message", message);
  });

  // 🔹 Typing status
  socket.on("typing", (username) => {
    const room = socket.data.room;
    if (room) {
      socket.to(room).emit("user-typing", username);
    }
  });

  // 🔹 Disconnect user
  socket.on("disconnect", () => {
    const room = socket.data?.room;
    const username = socket.data?.username;

    if (room && roomUsers[room]) {
      roomUsers[room] = roomUsers[room].filter(
        (user) => user.id !== socket.id
      );

      const updatedList =
        room === "general"
          ? [...defaultGeneralUsers, ...roomUsers[room]]
          : [...roomUsers[room]];

      io.to(room).emit("user-list", updatedList);
      io.to(room).emit("receive-message", {
        sender: "System",
        text: `${username} left the room.`,
        time: new Date().toLocaleTimeString(),
      });
    }

    console.log("❌ User disconnected");
  });
});

// Start server
server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
