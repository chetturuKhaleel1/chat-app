import { FaHome, FaComments, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import socket from "../socket"; // ✅ make sure this path is correct

const navItems = [
  { icon: <FaHome />, label: "Home", route: "/" },
  { icon: <FaComments />, label: "Chat", route: "/chat", query: "?username=GuestUser&room=general" },
  { icon: <FaCalendarAlt />, label: "Events", route: "#" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // ✅ Request room list when mounted
    socket.emit("get-room-list");

    // ✅ Listen for backend updates
    socket.on("room-list", (serverRooms) => {
      setRooms(serverRooms);
    });

    return () => {
      socket.off("room-list");
    };
  }, []);

  return (
    <div className="w-16 bg-white border-r flex flex-col items-center py-6 space-y-6 shadow-sm">
      {/* Static Nav */}
      {navItems.map((item, idx) => (
        <div
          key={idx}
          className="group relative flex items-center justify-center w-10 h-10 rounded hover:bg-blue-100 transition cursor-pointer"
          onClick={() => {
            if (item.query) {
              navigate(`${item.route}${item.query}`);
            } else {
              navigate(item.route);
            }
          }}
        >
          <div className="text-xl text-blue-600">{item.icon}</div>
          <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
            {item.label}
          </span>
        </div>
      ))}

      {/* Dynamic Rooms */}
      <div className="mt-6 w-full px-2">
        {rooms.map((room, idx) => (
          <div
            key={idx}
            className="w-full text-center py-2 text-sm rounded cursor-pointer hover:bg-blue-100 text-blue-700 font-medium"
            onClick={() => navigate(`/chat?username=GuestUser&room=${room.name}`)}
          >
            #{room.name}
          </div>
        ))}
      </div>
    </div>
  );
}
