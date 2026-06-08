import { useCallback, useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PreviewCard from "./components/PreviewCard";
import MovieDetailsModal from "./components/MovieDetailsModal";
import Home from "./pages/Home";
import Filmes from "./pages/Filmes";
import Series from "./pages/Series";
import Bombando from "./pages/Bombando";
import MinhaLista from "./pages/MinhaLista";
import Idiomas from "./pages/Idiomas";
import AccountTopicPage from "./pages/AccountTopicPage";
import ProfilesSettingsPage from "./pages/ProfilesSettingsPage";

const pagePaths = {
  home: "/",
  filmes: "/filmes",
  series: "/series",
  bombando: "/bombando",
  "minha-lista": "/minha-lista",
  idiomas: "/idiomas",
  "profiles-settings": "/conta/perfis",
  "account-topic": "/conta/topico"
};

function pageFromPath(pathname) {
  return Object.entries(pagePaths).find(([, path]) => path === pathname)?.[0] || "home";
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => pageFromPath(window.location.pathname));
  const [accountTopic, setAccountTopic] = useState("Visão geral");
  const [preview, setPreview] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [myList, setMyList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("iespflix:my-list")) || [];
    } catch {
      return [];
    }
  });
  const closeTimerRef = useRef(null);
  const isCatalogPage = currentPage === "filmes" || currentPage === "series";
  const isAccountPage = currentPage === "profiles-settings" || currentPage === "account-topic";
  const isInMyList = useCallback(
    (itemId) => myList.some((item) => item.id === itemId),
    [myList]
  );
  const toggleMyList = useCallback((item) => {
    setMyList((current) => {
      const exists = current.some((listItem) => listItem.id === item.id);

      return exists
        ? current.filter((listItem) => listItem.id !== item.id)
        : [item, ...current];
    });
  }, []);
  const cancelScheduledClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);
  const closePreview = useCallback(() => {
    cancelScheduledClose();
    setPreview(null);
  }, [cancelScheduledClose]);
  const scheduleClosePreview = useCallback(() => {
    cancelScheduledClose();
    closeTimerRef.current = setTimeout(() => {
      setPreview(null);
      closeTimerRef.current = null;
    }, 180);
  }, [cancelScheduledClose]);
  const openDetails = useCallback((item) => {
    cancelScheduledClose();
    setPreview(null);
    setSelectedMovie(item);
  }, [cancelScheduledClose]);
  const closeDetails = useCallback(() => {
    setSelectedMovie(null);
  }, []);
  const navigateTo = useCallback((page) => {
    const nextPath = pagePaths[page] || "/";

    setCurrentPage(page);

    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
  }, []);
  const handleLogout = useCallback(() => {
    navigateTo("home");
    setPreview(null);
    setSelectedMovie(null);
  }, [navigateTo]);
  const handleAction = useCallback((topic) => {
    setAccountTopic(topic);
    navigateTo("account-topic");
  }, [navigateTo]);

  useEffect(() => {
    localStorage.setItem("iespflix:my-list", JSON.stringify(myList));
  }, [myList]);

  useEffect(() => {
    function handlePopState() {
      setCurrentPage(pageFromPath(window.location.pathname));
    }

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    function handleOpenPreview(event) {
      cancelScheduledClose();
      setPreview(event.detail);
    }

    function handleOpenDetails(event) {
      openDetails(event.detail);
    }

    window.addEventListener("iespflix:open-preview", handleOpenPreview);
    window.addEventListener("iespflix:open-details", handleOpenDetails);
    window.addEventListener("iespflix:schedule-close-preview", scheduleClosePreview);
    window.addEventListener("iespflix:cancel-close-preview", cancelScheduledClose);

    return () => {
      window.removeEventListener("iespflix:open-preview", handleOpenPreview);
      window.removeEventListener("iespflix:open-details", handleOpenDetails);
      window.removeEventListener("iespflix:schedule-close-preview", scheduleClosePreview);
      window.removeEventListener("iespflix:cancel-close-preview", cancelScheduledClose);
      cancelScheduledClose();
    };
  }, [cancelScheduledClose, openDetails, scheduleClosePreview]);

  return (
    <div className={isAccountPage ? "app account-app" : isCatalogPage ? "app catalog-page" : "app"}>
      <Header
        currentPage={currentPage}
        setCurrentPage={navigateTo}
        onLogout={handleLogout}
        onAction={handleAction}
      />

      {currentPage === "home" && <Home />}
      {currentPage === "filmes" && <Filmes />}
      {currentPage === "series" && <Series />}
      {currentPage === "bombando" && <Bombando />}
      {currentPage === "minha-lista" && <MinhaLista items={myList} />}
      {currentPage === "idiomas" && <Idiomas />}
      {currentPage === "profiles-settings" && (
        <ProfilesSettingsPage onGoTo={navigateTo} onAction={handleAction} />
      )}
      {currentPage === "account-topic" && (
        <AccountTopicPage topic={accountTopic} onGoTo={navigateTo} onAction={handleAction} />
      )}

      {!isAccountPage && <Footer />}

      {!isAccountPage && preview && (
        <PreviewCard
          item={preview.item}
          position={preview.position}
          onClose={closePreview}
          isInMyList={isInMyList(preview.item.id)}
          onToggleMyList={toggleMyList}
          onOpenDetails={openDetails}
        />
      )}

      {!isAccountPage && selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={closeDetails}
          isInMyList={isInMyList(selectedMovie.id)}
          onToggleMyList={toggleMyList}
          onOpenDetails={openDetails}
        />
      )}
    </div>
  );
}
