import React from "react";
import { FaTrash, FaEdit, FaCheckCircle, FaRegCircle } from "react-icons/fa";

export default function EventItem({
  event,
  onDelete,
  onEdit,
  onToggleComplete,
}) {
  const eventDateTime = new Date(`${event.date}T${event.time}`);

  const isPast = eventDateTime < new Date();

  return (
    <li
      className={`flex items-center justify-between p-4 mb-3 rounded-lg shadow-md bg-white bg-opacity-90 animate-slideIn ${
        event.completed ? "opacity-50 line-through" : ""
      }`}
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-indigo-700 text-lg truncate">
          {event.title}
        </h3>
        <p className="text-gray-600 truncate">{event.description}</p>
        <p
          className={`text-sm mt-1 ${
            isPast ? "text-red-500" : "text-gray-500"
          }`}
        >
          {event.date} @ {event.time}
        </p>
      </div>

      <div className="flex space-x-3 ml-4">
        <button
          onClick={() => onToggleComplete(event.id)}
          className="text-green-600 hover:text-green-800 transition"
          title={event.completed ? "Mark as Incomplete" : "Mark as Completed"}
          aria-label="Toggle completed"
        >
          {event.completed ? <FaCheckCircle size={20} /> : <FaRegCircle size={20} />}
        </button>
        <button
          onClick={() => onEdit(event.id)}
          className="text-indigo-600 hover:text-indigo-800 transition"
          title="Edit Event"
          aria-label="Edit event"
        >
          <FaEdit size={20} />
        </button>
        <button
          onClick={() => onDelete(event.id)}
          className="text-red-600 hover:text-red-800 transition"
          title="Delete Event"
          aria-label="Delete event"
        >
          <FaTrash size={20} />
        </button>
      </div>
    </li>
  );
}
