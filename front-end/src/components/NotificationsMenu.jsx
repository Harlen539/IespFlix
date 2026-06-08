export default function NotificationsMenu({ notifications = [], onSelect }) {
  return (
    <div className="notifications-menu">
      <div className="menu-arrow" />

      {notifications.map((item) => (
        <button className="notification-item" key={item.id} onClick={() => onSelect?.(item)}>
          <img src={item.image} alt={item.title} className="notification-thumb" />

          <div>
            <p className="notification-title">{item.title}</p>
            <p className="notification-text">{item.text}</p>
            <span className="notification-date">{item.date}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
