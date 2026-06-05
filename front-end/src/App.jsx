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

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
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

  useEffect(() => {
    localStorage.setItem("iespflix:my-list", JSON.stringify(myList));
  }, [myList]);

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
    <div className={isCatalogPage ? "app catalog-page" : "app"}>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {currentPage === "home" && <Home />}
      {currentPage === "filmes" && <Filmes />}
      {currentPage === "series" && <Series />}
      {currentPage === "bombando" && <Bombando />}
      {currentPage === "minha-lista" && <MinhaLista items={myList} />}
      {currentPage === "idiomas" && <Idiomas />}

      <Footer />

      {preview && (
        <PreviewCard
          item={preview.item}
          position={preview.position}
          onClose={closePreview}
          isInMyList={isInMyList(preview.item.id)}
          onToggleMyList={toggleMyList}
          onOpenDetails={openDetails}
        />
      )}

      {selectedMovie && (
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
