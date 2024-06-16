import React, { createContext, useContext, useRef, useState } from "react";

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotifications] = useState([]);
  const notificationRef = useRef({});

  const addNotification = (data) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, ...data }]);
    notificationRef.current[id] = setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
      if (notificationRef.current[id]) {
        clearTimeout(notificationRef.current[id]);
        delete notificationRef.current[id];
      }
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ notification, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
