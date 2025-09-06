import React from "react";
import { useNavigate } from "react-router-dom";
import chatimg from "../assets/chatimg.jpg";

// ✅ Static room list
const rooms = [
  { name: "general", description: "💬 Talk about anything" },
  { name: "tech", description: "💻 Discuss coding and tech news" },
  { name: "fun", description: "😂 Share memes and jokes" },
  { name: "study", description: "📚 Study rooms and resources" },
  { name: "random", description: "🎲 Off-topic conversations" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGuestJoin = (room) => {
    const username = "GuestUser";
    navigate(`/chat?username=${username}&room=${room}`);
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#FFD500]">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6 bg-white shadow">
        <div className="text-2xl font-bold text-black">Simplr</div>
        <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
          <li className="cursor-pointer">Product</li>
          <li className="cursor-pointer">Partner with us</li>
          <li className="cursor-pointer">Contact us</li>
          <li className="cursor-pointer">Careers</li>
        </ul>
        <div className="flex gap-4">
          <button onClick={goToLogin} className="text-black">
            Login
          </button>
         <button onClick={goToLogin} className="bg-black text-white px-4 py-2 rounded-md">
  SIGN UP
</button>

        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-[#fdf6ec] to-white py-20 px-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-xl space-y-6">
          <h1 className="text-5xl font-bold text-black leading-tight">
            Stay Connected, <br /> Anytime, Anywhere
          </h1>
          <p className="text-lg text-gray-600">
            Chat effortlessly with friends and family — no matter the distance.
          </p>
          <div className="flex gap-4 flex-col sm:flex-row">
            <button
              onClick={goToLogin}
              className="bg-black text-white px-6 py-3 rounded-md shadow-md"
            >
              Sign Up / Login
            </button>
            <button
              onClick={() => handleGuestJoin("general")}
              className="bg-white border border-black text-black px-6 py-3 rounded-md shadow-md"
            >
              Continue as Guest
            </button>
          </div>
        </div>
        <img
          src={chatimg}
          alt="hero-graphic"
          className="w-[400px] mt-10 md:mt-0"
        />
      </section>

      {/* ROOM LIST SECTION */}
      <section className="py-16 px-6 bg-white text-black">
        <h2 className="text-3xl font-bold text-center mb-10">
          Available Chat Rooms
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {rooms.map((room, index) => (
            <div
              key={index}
              className="bg-[#f9f9fb] border border-gray-300 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all"
            >
              <h3 className="text-2xl font-bold mb-2 capitalize">
                {room.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {room.description || "Join the conversation."}
              </p>
              <button
                onClick={() => handleGuestJoin(room.name)}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
              >
                Join as Guest
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="flex flex-col md:flex-row text-white">
        <div className="flex-1 bg-[#FFD500] p-10 text-black">
          <h3 className="text-2xl font-bold mb-4">Real-Time Messaging</h3>
          <p>
            Experience instant communication with real-time messaging. Share
            photos, videos, and more — stay in the loop wherever you are.
          </p>
        </div>
        <div className="flex-1 bg-black p-10">
          <h3 className="text-2xl font-bold mb-4">Group Chats Made Easy</h3>
          <p>
            Organize your chats by topic, share updates, and collaborate with
            teammates. It's never been easier to plan together.
          </p>
        </div>
      </section>
    </div>
  );
}
