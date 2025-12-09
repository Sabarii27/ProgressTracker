import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Request notification permission on load
if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission();
}

// Example: function to show a notification (can be called from anywhere)
export function showTaskReminderNotification() {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Task Reminder', {
      body: 'Don\'t forget to complete your tasks today!',
      icon: '/favicon.ico',
    });
  }
}
