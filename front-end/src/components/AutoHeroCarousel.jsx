import { useEffect, useState } from "react";
import {
  Info,
  Play,
  Volume2,
  VolumeX
} from "lucide-react";
import MediaImage from "./MediaImage";

export default function AutoHeroCarousel({ slides = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);

  const safeSlides = slides.filter((slide) => slide?.backdrop || slide?.image);
  const currentSlide = safeSlides[currentIndex];

  useEffect(() => {
    if (!safeSlides.length || paused) return;

    const timer = setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % safeSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [safeSlides.length, paused]);

  if (!currentSlide) return null;

  function openDetails() {
    window.dispatchEvent(new CustomEvent("iespflix:open-details", {
      detail: currentSlide
    }));
  }

  return (
    <section
      className="auto-hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="auto-hero-image-wrap">
        <MediaImage
          src={currentSlide.backdrop || currentSlide.image}
          alt={currentSlide.title}
          title={currentSlide.title}
          className="auto-hero-image"
          variant="hero"
        />
      </div>

      <div className="auto-hero-overlay" />
      <div className="auto-hero-bottom-fade" />

      <div className="auto-hero-content">
        <p className="auto-hero-brand">IESPFLIX</p>
        <h1>{currentSlide.title}</h1>

        {currentSlide.subtitle && <h2>{currentSlide.subtitle}</h2>}

        <p className="auto-hero-description">{currentSlide.description}</p>

        <div className="auto-hero-actions">
          <button className="watch-btn" id="watch-btn">
            <Play size={31} fill="black" />
            Assistir
          </button>

          <button className="info-btn" id="info-btn" onClick={openDetails}>
            <Info size={27} />
            Mais informações
          </button>
        </div>
      </div>

      {safeSlides.length > 1 && (
        <div className="hero-dots">
          {safeSlides.map((slide, index) => (
            <button
              key={slide.id}
              className={index === currentIndex ? "hero-dot active" : "hero-dot"}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}

      <div className="hero-controls">
        <button className="volume-btn" onClick={() => setMuted((value) => !value)}>
          {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>

        <span className="rating">{currentSlide.rating}</span>
      </div>
    </section>
  );
}
