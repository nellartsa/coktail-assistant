import { useNotification } from "./NotificationContext";

const Toaster = () => {
  const { notification } = useNotification();

  return (
    <div className="toaster">
      {notification.map((notif, index) => (
        <div
          className={`message
          ${notif.type === "warning" ? "warning" : ""}
          ${notif.type === "success" ? "success" : ""}
          ${notif.type === "danger" ? "danger" : ""}
        
        `}
          key={index}
        >
          {notif.message}
        </div>
      ))}
    </div>
  );
};

export default Toaster;
