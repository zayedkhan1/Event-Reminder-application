import React, { useState, useEffect, useRef } from "react";
import { FaUserAlt, FaPlus } from "react-icons/fa";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import ReminderModal from "./components/ReminderModal";
import { getEventsFromStorage, saveEventsToStorage } from "./utils";

/**
 * App - root component
 * Fixes:
 * - Pass correct props to EventForm: onSave and onCancel
 * - Uses notifiedEvents ref to prevent duplicate notifications/modal popups
 * - Modal has ability to mark event as completed (via onComplete)
 * - Interval checks every 10s, notifies for events within +/- 60s window
 */
export default function App() {
  const [events, setEvents] = useState(() => getEventsFromStorage());
  const [editingEventId, setEditingEventId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState(null);

  // Reminder modal event
  const [reminderEvent, setReminderEvent] = useState(null);

  // Keep track of which events we've already notified about / shown modal for
  const notifiedEvents = useRef(new Set());

  // Request permission for notifications on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Save events to storage whenever they change
  useEffect(() => {
    saveEventsToStorage(events);
  }, [events]);

  // Sync across other tabs/windows (storage event)
  useEffect(() => {
    function onStorageChange(e) {
      if (e.key === "event_reminder_events") {
        setEvents(e.newValue ? JSON.parse(e.newValue) : []);
      }
    }
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  // Reminder check: every 10 seconds look for events that are within +/-60s window
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      events.forEach((ev) => {
        if (ev.completed) return; // skip completed events
        if (notifiedEvents.current.has(ev.id)) return; // already notified

        const eventDateTime = new Date(`${ev.date}T${ev.time}`);
        const diffMs = eventDateTime - now;

        // If the event is within 60 seconds (either about to start or just started)
        if (Math.abs(diffMs) <= 60_000) {
          // Browser notification (OS-level)
          if (Notification.permission === "granted") {
            try {
              new Notification("Event Reminder", {
                body: ev.title,
                // icon can be left or removed, keep small CDN icon (optional)
                icon: "https://cdn-icons-png.flaticon.com/512/2877/2877081.png",
              });
            } catch (err) {
              // ignore notification errors
              console.warn("Notification error:", err);
            }
          }

          // Mark this event as notified to avoid repeated popups
          notifiedEvents.current.add(ev.id);

          // Show app modal (the modal will show when user opens the app)
          setReminderEvent(ev);
        }
      });
    }, 10_000); // 10 seconds

    return () => clearInterval(interval);
  }, [events]);

  // Save or update an event (passed to EventForm as onSave)
  function handleSaveEvent(eventData) {
    if (editingEventId) {
      // update
      setEvents((prev) => prev.map((ev) => (ev.id === editingEventId ? eventData : ev)));
      setMessage("Event updated successfully.");
    } else {
      // add new
      setEvents((prev) => [...prev, eventData]);
      setMessage("Event added successfully.");
    }
    setShowForm(false);
    setEditingEventId(null);
    // clear message after 2.5s
    setTimeout(() => setMessage(null), 2500);
  }

  // Cancel handler for form -> hide form and clear editing
  function handleCancel() {
    setShowForm(false);
    setEditingEventId(null);
  }

  // Delete event
  function handleDeleteEvent(id) {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
    // also clear any notified flag for it
    notifiedEvents.current.delete(id);
    setMessage("Event deleted.");
    setTimeout(() => setMessage(null), 2500);
  }

  // Edit event: set editing id and show form
  function handleEditEvent(id) {
    setEditingEventId(id);
    setShowForm(true);
  }

  // Toggle complete (used in list & modal)
  function handleToggleComplete(id) {
    setEvents((prev) => prev.map((ev) => (ev.id === id ? { ...ev, completed: !ev.completed } : ev)));
    // ensure we don't re-notify if user marks it completed
    notifiedEvents.current.add(id);
  }

  // Modal close handler (just close modal)
  function handleCloseModal() {
    setReminderEvent(null);
  }

  // Modal "mark done" handler
  function handleModalMarkDone(id) {
    handleToggleComplete(id);
    setReminderEvent(null);
  }

  const editingEvent = events.find((ev) => ev.id === editingEventId) || null;

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-90 rounded-xl shadow-xl p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-indigo-700 font-extrabold text-3xl flex items-center gap-3">
            <FaUserAlt /> Event Reminder
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingEventId(null);
                setShowForm(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition"
            >
              <FaPlus /> Add Event
            </button>
          </div>
        </header>

        {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{message}</div>}

        {showForm ? (
          // IMPORTANT: EventForm expects onSave and onCancel
          <EventForm existingEvent={editingEvent} onSave={handleSaveEvent} onCancel={handleCancel} />
        ) : (
          <EventList events={events} onDelete={handleDeleteEvent} onEdit={handleEditEvent} onToggleComplete={handleToggleComplete} />
        )}

        <footer className="text-center text-gray-600 mt-8 text-sm select-none">
          &copy; {new Date().getFullYear()} Event Reminder App. Made with ❤️ by Zayed Khan
        </footer>
      </div>

      {/* Reminder modal */}
      {reminderEvent && (
        <ReminderModal
          event={reminderEvent}
          onClose={handleCloseModal}
          onComplete={() => handleModalMarkDone(reminderEvent.id)}
        />
      )}
    </div>
  );
}
