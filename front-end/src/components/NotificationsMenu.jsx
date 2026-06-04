export default function NotificationsMenu({ notifications = [] }) {
  return (
    <div className="notifications-menu">
      <div className="menu-arrow" />

      {notifications.map((item) => (
        <div className="notification-item" key={item.id}>
          <img src={item.image} alt={item.title} className="notification-thumb" />

          <div>
            <p className="notification-title">{item.title}</p>
            <p className="notification-text">{item.text}</p>
            <span className="notification-date">{item.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
