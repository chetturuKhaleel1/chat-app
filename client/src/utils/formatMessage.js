import DOMPurify from "dompurify";

// Simple emoji map
const emojiMap = {
  smile: "😄",
  heart: "❤️",
  thumbsup: "👍",
  fire: "🔥",
  cry: "😢",
  laugh: "😂",
  angry: "😠",
  rocket: "🚀",
};

export function formatMessage(text) {
  if (!text) return "";

  // 1. Escape HTML
  let safe = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2. Bold: **bold**
  safe = safe.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // 3. Italic: *italic*
  safe = safe.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // 4. Inline Code: `code`
  safe = safe.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>');

  // 5. Link: [text](https://...)
  safe = safe.replace(
    /\[(.*?)\]\((https?:\/\/[^\s]+)\)/g,
    '<a href="$2" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // 6. Emoji: :smile:
  safe = safe.replace(/:([a-z0-9_+-]+):/gi, (match, p1) => {
    return emojiMap[p1.toLowerCase()] || match;
  });

  // 7. Mentions: @username
  safe = safe.replace(/@(\w+)/g, '<span class="mention text-purple-600 font-semibold">@$1</span>');

  return DOMPurify.sanitize(safe);
}
