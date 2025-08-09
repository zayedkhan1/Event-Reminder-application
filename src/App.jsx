import React, { useState, useEffect, useRef } from "react";
import { 
  FaUserAlt, 
  FaPlus, 
  FaBell, 
  FaCalendarAlt, 
  FaCheck,
  FaChartLine
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import ReminderModal from "./components/ReminderModal";
import { getEventsFromStorage, saveEventsToStorage } from "./utils";
import { FaUsers, FaCog, FaStar, FaLightbulb } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';



export default function App() {
  const [events, setEvents] = useState(() => getEventsFromStorage());
  const [editingEventId, setEditingEventId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState(null);
  const [reminderEvent, setReminderEvent] = useState(null);
  const notifiedEvents = useRef(new Set());
//js features
  const features = [
  {
    icon: <FaBell className="text-xl" />,
    title: "Smart Reminders",
    description: "Get notified before important events with customizable alerts"
  },
  {
    icon: <FaCalendarAlt className="text-xl" />,
    title: "Beautiful Calendar",
    description: "Visualize your schedule with our intuitive calendar interface"
  },
  {
    icon: <FaChartLine className="text-xl" />,
    title: "Analytics",
    description: "Track your event patterns and optimize your schedule"
  },
  {
    icon: <FaUsers className="text-xl" />,
    title: "Team Collaboration",
    description: "Share events and coordinate schedules with your team"
  },
  {
    icon: <FaCog className="text-xl" />,
    title: "Customization",
    description: "Personalize your experience with themes and settings"
  },
  {
    icon: <FiExternalLink className="text-xl" />,
    title: "Integrations",
    description: "Connect with your favorite calendar and productivity apps"
  }
];

// Data for testimonials
const testimonials = [
  {
    quote: "This app has completely transformed how I manage my schedule. I haven't missed a single important event since I started using it!",
    name: "Sarah Johnson",
    role: "Marketing Director",
    initials: "SJ"
  },
  {
    quote: "The reminders are so reliable and the interface is beautiful. Worth every penny of the Pro subscription.",
    name: "Michael Chen",
    role: "Software Engineer",
    initials: "MC"
  },
  {
    quote: "Our team uses this for all our project deadlines. It's become an essential part of our workflow.",
    name: "David Wilson",
    role: "Project Manager",
    initials: "DW"
  }
];
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
        if (ev.completed) return;
        if (notifiedEvents.current.has(ev.id)) return;

        const eventDateTime = new Date(`${ev.date}T${ev.time}`);
        const diffMs = eventDateTime - now;

        if (Math.abs(diffMs) <= 60_000) {
          if (Notification.permission === "granted") {
            try {
              new Notification("Event Reminder", {
                body: ev.title,
                icon: "https://cdn-icons-png.flaticon.com/512/2877/2877081.png",
              });
            } catch (err) {
              console.warn("Notification error:", err);
            }
          }

          notifiedEvents.current.add(ev.id);
          setReminderEvent(ev);
        }
      });
    }, 10_000);

    return () => clearInterval(interval);
  }, [events]);

  function handleSaveEvent(eventData) {
    if (editingEventId) {
      setEvents((prev) => prev.map((ev) => (ev.id === editingEventId ? eventData : ev)));
      setMessage("Event updated successfully.");
    } else {
      setEvents((prev) => [...prev, eventData]);
      setMessage("Event added successfully.");
    }
    setShowForm(false);
    setEditingEventId(null);
    setTimeout(() => setMessage(null), 2500);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingEventId(null);
  }

  function handleDeleteEvent(id) {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
    notifiedEvents.current.delete(id);
    setMessage("Event deleted.");
    setTimeout(() => setMessage(null), 2500);
  }

  function handleEditEvent(id) {
    setEditingEventId(id);
    setShowForm(true);
  }

  function handleToggleComplete(id) {
    setEvents((prev) => prev.map((ev) => (ev.id === id ? { ...ev, completed: !ev.completed } : ev)));
    notifiedEvents.current.add(id);
  }

  function handleCloseModal() {
    setReminderEvent(null);
  }

  function handleModalMarkDone(id) {
    handleToggleComplete(id);
    setReminderEvent(null);
  }

  const editingEvent = events.find((ev) => ev.id === editingEventId) || null;

  return (
   <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">

    {/* old hero */}
     <section className="relative overflow-hidden bg-gradient-to-r from-indigo-300 to-purple-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full p-4 mb-4">
              <FaBell className="text-3xl" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Never Miss an Important Event Again
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Smart reminders, beautiful calendar, and powerful scheduling for your busy life.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
            onClick={() => {
                 setEditingEventId(null);
                setShowForm(true);
              }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
              <FaPlus /> Get Started
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-lg font-medium text-lg shadow hover:shadow-md transition-all flex items-center justify-center gap-2 border border-gray-200">
              <FiExternalLink /> See Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 rounded-xl shadow-2xl overflow-hidden border border-gray-200"
          >
           
          </motion.div>
        </div>

      
      </section>
      {/* Hero Section */}

     <div className="bg-gradient-to-r from-purple-300 to-indigo-300 pb-4 px-4">
       <div className="max-w-7xl mx-auto to-indigo-300 rounded-xl  p-6">
         <header className="flex items-center justify-between mb-6 md:px-40">
           <h1 className="text-indigo-700 font-extrabold text-3xl flex items-center gap-3">
             <FaUserAlt /> Event Reminder           </h1>
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
{/* hero sectoin */}
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Powerful Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Everything you need to stay organized and on top of your schedule
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all"
              >
                <div className="bg-indigo-100 text-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4"
            >
              <FaStar className="text-yellow-300" />
              <span>Premium</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Upgrade Your Experience
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl text-indigo-100 max-w-3xl mx-auto"
            >
              Unlock advanced features and customization options
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
            >
              <h3 className="text-2xl font-bold mb-4">Basic</h3>
              <div className="text-4xl font-bold mb-6">$0<span className="text-xl text-white/70">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2"><FaCheck className="text-green-300" /> Basic reminders</li>
                <li className="flex items-center gap-2"><FaCheck className="text-green-300" /> 5 events</li>
                <li className="flex items-center gap-2 text-white/50"><FaLightbulb /> No advanced features</li>
              </ul>
              <button className="w-full bg-white text-indigo-600 hover:bg-gray-100 py-3 rounded-lg font-medium">
                Current Plan
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white text-indigo-600 rounded-xl p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 bg-yellow-400 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <div className="text-4xl font-bold mb-6">$9<span className="text-xl text-indigo-400">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2"><FaCheck className="text-green-500" /> Unlimited events</li>
                <li className="flex items-center gap-2"><FaCheck className="text-green-500" /> Advanced notifications</li>
                <li className="flex items-center gap-2"><FaCheck className="text-green-500" /> Calendar integration</li>
                <li className="flex items-center gap-2"><FaCheck className="text-green-500" /> Custom themes</li>
              </ul>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium">
                Upgrade Now
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
            >
              <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
              <div className="text-4xl font-bold mb-6">$29<span className="text-xl text-white/70">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2"><FaCheck className="text-green-300" /> All Pro features</li>
                <li className="flex items-center gap-2"><FaCheck className="text-green-300" /> Team collaboration</li>
                <li className="flex items-center gap-2"><FaCheck className="text-green-300" /> Priority support</li>
                <li className="flex items-center gap-2"><FaCheck className="text-green-300" /> API access</li>
              </ul>
              <button className="w-full bg-white text-indigo-600 hover:bg-gray-100 py-3 rounded-lg font-medium">
                Contact Sales
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              What Our Users Say
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Join thousands of satisfied users who transformed their scheduling
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 text-indigo-600 rounded-full w-12 h-12 flex items-center justify-center font-bold">
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-indigo-100 text-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6"
          >
            <FaBell className="text-2xl" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          >
            Ready to Transform Your Scheduling?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            Join thousands of users who never miss important events anymore
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto">
              <FaPlus /> Get Started for Free
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Event Reminder</h3>
              <p className="mb-4">Never miss an important event again with our smart reminder system.</p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
         <footer >
          &copy; {new Date().getFullYear()} Event Reminder App. Made with ❤️ by Zayed Khan
        </footer>          </div>
        </div>
      </footer>
    </div>

  );
}
