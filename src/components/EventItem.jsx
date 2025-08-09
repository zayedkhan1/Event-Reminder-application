import React from "react";
import { FaTrash, FaEdit, FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { FaCalendarDay, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
export default function EventItem({
  event,
  onDelete,
  onEdit,
  onToggleComplete,
}) {
  const eventDateTime = new Date(`${event.date}T${event.time}`);

  const isPast = eventDateTime < new Date();

  return (
    // <li
    //   className={`flex items-center justify-between p-4 mb-3 rounded-lg shadow-md bg-white bg-opacity-90 animate-slideIn ${
    //     event.completed ? "opacity-50 line-through" : ""
    //   }`}
    // >
    //   <div className="flex-1 min-w-0">
    //     <h3 className="font-semibold text-indigo-700 text-lg truncate">
    //       {event.title}
    //     </h3>
    //     <p className="text-gray-600 truncate">{event.description}</p>
    //     <p
    //       className={`text-sm mt-1 ${
    //         isPast ? "text-red-500" : "text-gray-500"
    //       }`}
    //     >
    //       {event.date} @ {event.time}
    //     </p>
    //   </div>

    //   <div className="flex space-x-3 ml-4">
    //     <button
    //       onClick={() => onToggleComplete(event.id)}
    //       className="text-green-600 hover:text-green-800 transition"
    //       title={event.completed ? "Mark as Incomplete" : "Mark as Completed"}
    //       aria-label="Toggle completed"
    //     >
    //       {event.completed ? <FaCheckCircle size={20} /> : <FaRegCircle size={20} />}
    //     </button>
    //     <button
    //       onClick={() => onEdit(event.id)}
    //       className="text-indigo-600 hover:text-indigo-800 transition"
    //       title="Edit Event"
    //       aria-label="Edit event"
    //     >
    //       <FaEdit size={20} />
    //     </button>
    //     <button
    //       onClick={() => onDelete(event.id)}
    //       className="text-red-600 hover:text-red-800 transition"
    //       title="Delete Event"
    //       aria-label="Delete event"
    //     >
    //       <FaTrash size={20} />
    //     </button>
    //   </div>
    // </li>
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={`relative p-5 mb-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${
        event.completed ? 'bg-gray-50' : 'bg-white'
      } ${
        isPast && !event.completed ? 'border-l-4 border-l-red-400' : ''
      }`}
    >
      {/* Completed ribbon */}
      {event.completed && (
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-xl">
          Completed
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold text-lg truncate ${
              event.completed ? 'text-gray-400 line-through' : 'text-gray-800'
            }`}>
              {event.title}
            </h3>
          </div>
          
          {event.description && (
            <p className={`text-sm ${
              event.completed ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {event.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center text-sm">
              <FaCalendarDay className="mr-2 text-indigo-500" />
              <span className={event.completed ? 'text-gray-400' : 'text-gray-600'}>
                {event.date}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <FaClock className="mr-2 text-indigo-500" />
              <span className={event.completed ? 'text-gray-400' : 'text-gray-600'}>
                {event.time}
              </span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 sm:space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggleComplete(event.id)}
            className={`p-2 rounded-full ${
              event.completed 
                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
            title={event.completed ? "Mark as Incomplete" : "Mark as Completed"}
            aria-label="Toggle completed"
          >
            {event.completed ? <FaCheckCircle size={18} /> : <FaRegCircle size={18} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(event.id)}
            className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
            title="Edit Event"
            aria-label="Edit event"
          >
            <FaEdit size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(event.id)}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
            title="Delete Event"
            aria-label="Delete event"
          >
            <FaTrash size={18} />
          </motion.button>
        </div>
      </div>
    </motion.li>
  );
}
