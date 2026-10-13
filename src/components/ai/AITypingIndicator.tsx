export function AITypingIndicator() {
  return (
    <div className="flex justify-start animate-fade">
      <div className="glass glass-specular rounded-3xl rounded-bl-lg px-4 py-3 flex items-center gap-1.5 shadow-sm">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-pink-500/70"
            style={{ animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
        <style>{`@keyframes bounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; } 40% { transform: scale(1); opacity: 1; } }`}</style>
      </div>
    </div>
  );
}
