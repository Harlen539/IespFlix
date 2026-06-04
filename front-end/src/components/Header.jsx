import { useEffect, useState } from "react";
import { Bell, ChevronDown, Menu, Search, X } from "lucide-react";
import NotificationsMenu from "./NotificationsMenu";
import ProfileMenu from "./ProfileMenu";
import { getNotifications, getProfiles } from "../services/api";

const navItems = [
  { id: "home", label: "Início" },
  { id: "series", label: "Séries" },
  { id: "filmes", label: "Filmes" },
  { id: "bombando", label: "Bombando" },
  { id: "minha-lista", label: "Minha lista" },
  { id: "idiomas", label: "Navegar por idiomas" }
];

export default function Header({ currentPage, setCurrentPage }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getProfiles().then(setProfiles).catch(() => setProfiles([]));
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
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <header className={scrolled ? "header header-scrolled" : "header header-at-top"}>
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
          <Menu size={24} />
        </button>

        <button className="logo-button" onClick={() => goTo("home")}>
          <img src="/assets/iespflix-logo.png" alt="IESPFLIX" className="brand-logo" />
          <span className="brand-fallback">IESPFLIX</span>
        </button>

        <nav className="desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={currentPage === item.id ? "nav-link active" : "nav-link"}
              onClick={() => goTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="header-right">
        <button className="icon-btn" id="search-btn">
          <Search size={23} />
        </button>

        <button className="kids-btn">Infantil</button>

        <div className="relative">
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

          {notifOpen && <NotificationsMenu notifications={notifications} />}
        </div>

        <div className="relative">
          <button
            className="profile-trigger"
            id="profile-btn"
            onClick={() => {
              setProfileOpen((value) => !value);
              setNotifOpen(false);
            }}
          >
            <span className="avatar-mini">👩</span>
            <ChevronDown size={16} />
          </button>

          {profileOpen && <ProfileMenu profiles={profiles} />}
        </div>
      </div>

      {mobileOpen && (
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
