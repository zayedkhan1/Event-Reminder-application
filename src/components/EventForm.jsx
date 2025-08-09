import React, { useState, useEffect } from "react";

export default function EventForm({ onSave, onCancel, existingEvent }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent.title);
      setDescription(existingEvent.description);
      setDate(existingEvent.date);
      setTime(existingEvent.time);
    }
  }, [existingEvent]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title || !date || !time) {
      alert("Please fill in at least title, date, and time.");
      return;
    }

    const eventData = {
      id: existingEvent ? existingEvent.id : Date.now(),
      title,
      description,
      date,
      time,
      completed: existingEvent ? existingEvent.completed : false,
      createdAt: existingEvent ? existingEvent.createdAt : Date.now(),
    };
    onSave(eventData);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white bg-opacity-90 rounded-lg p-6 shadow-lg max-w-md mx-auto animate-fadeIn"
    >
      <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
        {existingEvent ? "Edit Event" : "Add New Event"}
      </h2>

      <label className="block mb-2 font-medium text-gray-700">Title*</label>
      <input
        type="text"
        className="w-full px-4 py-2 mb-4 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Event title"
        required
      />

      <label className="block mb-2 font-medium text-gray-700">Description</label>
      <textarea
        className="w-full px-4 py-2 mb-4 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
        rows="3"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Event description (optional)"
      />

      <div className="flex space-x-4 mb-4">
        <div className="flex-1">
          <label className="block mb-2 font-medium text-gray-700">Date*</label>
          <input
            type="date"
            className="w-full px-4 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <label className="block mb-2 font-medium text-gray-700">Time*</label>
          <input
            type="time"
            className="w-full px-4 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md border border-indigo-500 text-indigo-600 hover:bg-indigo-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          {existingEvent ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}
