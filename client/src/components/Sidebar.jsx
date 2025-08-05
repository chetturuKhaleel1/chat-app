import { FaHome, FaComments, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const navItems = [
  { icon: <FaHome />, label: "Home", route: "/" },
  { icon: <FaComments />, label: "Chat", route: "/chat", query: "?username=GuestUser&room=General" },
  { icon: <FaCalendarAlt />, label: "Events", route: "#" }, // Update later
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-16 bg-white border-r flex flex-col items-center py-6 space-y-6 shadow-sm">
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
    </div>
  );
}
