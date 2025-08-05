import React from "react";
import { formatMessage } from "../utils/formatMessage"; // ✅ Correct
 // Remove curly braces

export default function MessageBubble({ sender, text, time, isSelf }) {
  return (
    <div className={`flex ${isSelf ? "justify-end" : "justify-start"} px-2`}>
      <div
        className={`max-w-xs p-3 rounded-xl text-sm shadow-md ${
          isSelf
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        {!isSelf && <div className="font-bold mb-1">{sender}</div>}

        <div
          dangerouslySetInnerHTML={{ __html: formatMessage(text) }}
          className="break-words [&_strong]:font-bold [&_em]:italic [&_a]:underline [&_a]:text-blue-300"
        />

        <div
          className={`text-[10px] text-right mt-1 ${
            isSelf ? "text-white/70" : "text-gray-500"
          }`}
        >
          {time}
        </div>
      </div>
    </div>
  );
}
