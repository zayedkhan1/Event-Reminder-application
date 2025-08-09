// Local Storage utils with 30-day expiration

export const STORAGE_KEY = "event_reminder_events";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export function getEventsFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const events = JSON.parse(data);

    const now = Date.now();

    // Filter out events older than 30 days based on createdAt timestamp
    const filteredEvents = events.filter((event) => {
      if (!event.createdAt) return true;
      return now - event.createdAt <= THIRTY_DAYS_MS;
    });

    // Save cleaned events back to localStorage
    if (filteredEvents.length !== events.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEvents));
    }

    return filteredEvents;
  } catch {
    return [];
  }
}

export function saveEventsToStorage(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function isPast(dateTime) {
  return new Date(dateTime) < new Date();
}
