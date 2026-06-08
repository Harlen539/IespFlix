import { useEffect, useState } from "react";
import { Bell, ChevronDown, Menu, Search, X } from "lucide-react";
import AccountDropdown from "./AccountDropdown";
import NotificationsMenu from "./NotificationsMenu";
import ProfileMenu from "./ProfileMenu";
import { getNotifications } from "../services/api";

const navItems = [
  { id: "home", label: "Início" },
  { id: "series", label: "Séries" },
  { id: "filmes", label: "Filmes" },
  { id: "bombando", label: "Bombando" },
  { id: "minha-lista", label: "Minha lista" },
  { id: "idiomas", label: "Navegar por idiomas" }
];

export default function Header({ currentPage, setCurrentPage, onLogout, onAction }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const isAccountPage = currentPage === "profiles-settings" || currentPage === "account-topic";

  useEffect(() => {
    getNotifications().then(setNotifications).catch(() => setNotifications([]));
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function goTo(page) {
    setCurrentPage(page);
    setProfileOpen(false);
    setNotifOpen(false);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <header className={isAccountPage ? "header account-header" : scrolled ? "header header-scrolled" : "header header-at-top"}>
      <div className="header-left">
        {!isAccountPage && (
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
          <Menu size={24} />
          </button>
        )}

        <button className="logo-button" onClick={() => goTo("home")}>
          <img src="/assets/iespflix-logo.png" alt="IESPFLIX" className="brand-logo" />
          <span className="brand-fallback">IESPFLIX</span>
        </button>

        {!isAccountPage && <nav className="desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={currentPage === item.id ? "nav-link active" : "nav-link"}
              onClick={() => goTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>}
      </div>

      <div className="header-right">
        {!isAccountPage && <button
          className="icon-btn"
          id="search-btn"
          onClick={() => onAction?.("Busca aberta.")}
        >
          <Search size={23} />
        </button>}

        {!isAccountPage && <button className="kids-btn" onClick={() => onAction?.("Área Infantil aberta.")}>
          Infantil
        </button>}

        {!isAccountPage && <div className="relative">
          <button
            className="icon-btn"
            id="notifications-btn"
            onClick={() => {
              setNotifOpen((value) => !value);
              setProfileOpen(false);
            }}
          >
            <Bell size={22} />
          </button>

          {notifOpen && (
            <NotificationsMenu
              notifications={notifications}
              onSelect={(item) => {
                onAction?.(`Notificação aberta: ${item.title}`);
                setNotifOpen(false);
              }}
            />
          )}
        </div>}

        <div className="relative">
          <button
            className="profile-trigger"
            id="profile-btn"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => {
              setProfileOpen((value) => !value);
              setNotifOpen(false);
            }}
          >
            <span className="avatar-mini">👩</span>
            <ChevronDown size={16} />
          </button>

          {profileOpen && (
            isAccountPage ? (
              <AccountDropdown
                onClose={() => setProfileOpen(false)}
                onGoTo={goTo}
                onLogout={onLogout}
                onAction={onAction}
              />
            ) : (
              <ProfileMenu
                onClose={() => setProfileOpen(false)}
                onGoTo={goTo}
                onLogout={onLogout}
                onAction={onAction}
              />
            )
          )}
        </div>
      </div>

      {!isAccountPage && mobileOpen && (
        <div className="mobile-panel">
          <div className="mobile-panel-header">
            <img src="/assets/iespflix-logo.jpeg" alt="IESPFLIX" className="mobile-logo" />
            <button className="icon-btn" onClick={() => setMobileOpen(false)}>
              <X size={26} />
            </button>
          </div>

          <nav className="mobile-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={currentPage === item.id ? "mobile-nav-link active" : "mobile-nav-link"}
                onClick={() => goTo(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
