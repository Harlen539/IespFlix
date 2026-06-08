import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export default function ScrollableRow({ children, className = "", label }) {
  const scrollerRef = useRef(null);

  function scrollByPage(direction) {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: direction * Math.max(scroller.clientWidth * 0.86, 260),
      behavior: "smooth"
    });
  }

  return (
    <div className="row-scroll-area">
      <button
        className="row-scroll-button row-scroll-button-left"
        type="button"
        aria-label={`Ver títulos anteriores em ${label}`}
        onClick={() => scrollByPage(-1)}
      >
        <ChevronLeft size={34} />
      </button>

      <div ref={scrollerRef} className={className}>
        {children}
      </div>

      <button
        className="row-scroll-button row-scroll-button-right"
        type="button"
        aria-label={`Ver mais títulos em ${label}`}
        onClick={() => scrollByPage(1)}
      >
        <ChevronRight size={34} />
      </button>
    </div>
  );
}
