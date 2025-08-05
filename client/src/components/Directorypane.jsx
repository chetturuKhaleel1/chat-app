import React, { useState, useEffect } from "react";

export default function Directorypane({ users = [], onPrivateMessage, currentUserId }) {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  const handlePrivateMessage = (user) => {
    if (onPrivateMessage && user.id !== currentUserId) {
      onPrivateMessage(user.id);
    }
  };

  return (
    <div className="w-64 bg-white border-l p-4 flex flex-col">
      <h3 className="text-lg font-semibold mb-2 text-blue-600">Users</h3>

      <input
        type="text"
        placeholder="Search user..."
        className="mb-3 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="space-y-2 overflow-y-auto flex-1">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`bg-blue-50 border px-3 py-2 rounded text-sm cursor-pointer hover:bg-blue-100 ${
                user.id === currentUserId ? "opacity-60 cursor-not-allowed" : ""
              }`}
              onClick={() => handlePrivateMessage(user)}
              title={user.id === currentUserId ? "This is you" : "Click to send private message"}
            >
              {user.username}
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-400">No users found</div>
        )}
      </div>
    </div>
  );
}
