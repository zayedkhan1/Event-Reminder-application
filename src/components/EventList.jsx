import React from "react";
import EventItem from "./EventItem";

export default function EventList({
  events,
  onDelete,
  onEdit,
  onToggleComplete,
}) {
  if (events.length === 0) {
    return (
      <p className="text-center text-white text-lg mt-10">
        No events added yet. Start by adding a new event!
      </p>
    );
  }

  // Sort events by date/time ascending
  const sortedEvents = [...events].sort((a, b) => {
    const dtA = new Date(`${a.date}T${a.time}`);
    const dtB = new Date(`${b.date}T${b.time}`);
    return dtA - dtB;
  });

  return (
    <ul className="mt-6 space-y-3 max-w-3xl mx-auto">
      {sortedEvents.map((event) => (
        <EventItem
          key={event.id}
          event={event}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </ul>
  );
}
