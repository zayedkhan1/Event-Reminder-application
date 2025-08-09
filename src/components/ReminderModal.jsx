import React, { useEffect } from "react";
import { FaTimesCircle } from "react-icons/fa";

export default function ReminderModal({ event, onClose, onComplete }) {
  useEffect(() => {
    // Play alert sound on modal open
    const audio = new Audio("/alert.mp3"); // must be in public folder
    audio.play().catch(err => console.warn("Audio play blocked:", err));

    // Stop after 3 seconds
    const timer = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!event) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
      style={{
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      {/* Keyframes injected directly into JSX */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes scaleIn {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>

      <div
        className="relative w-96 max-w-[90%] bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden transform transition-all"
        style={{
          animation: "scaleIn 0.25s ease-out",
        }}
      >
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-5 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white tracking-wide">⏰ Event Reminder</h2>
          <button
            onClick={onClose}
            className="text-white hover:scale-110 transition-transform duration-200"
            aria-label="Close"
          >
            <FaTimesCircle size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-800">{event.title}</h3>
          {event.description && (
            <p className="text-gray-600 mt-2 leading-relaxed">{event.description}</p>
          )}
          <p className="mt-4 text-sm text-gray-500 italic">
            Scheduled at:{" "}
            <span className="font-medium">
              {event.date} {event.time}
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-700 font-medium"
          >
            Dismiss
          </button>

          <button
            onClick={() => onComplete(event.id)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-lg hover:shadow-purple-500/50 transition-all duration-200 hover:scale-105"
          >
            ✅ Mark Done
          </button>
        </div>
      </div>
    </div>
  );
}
