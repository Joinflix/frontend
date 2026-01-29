import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import MovieCard from "./MovieCard";

const RowCarousel = ({ title, items }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.offsetWidth * 0.8;

    rowRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full py-6 group">
      <h2 className="text-white text-lg font-semibold mb-3 px-8">{title}</h2>

      {/* left arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 p-2 hidden group-hover:block"
      >
        <ChevronLeft className="text-white" />
      </button>

      {/* row */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-scroll scroll-smooth px-8 scrollbar-hide"
      >
        {items.map((item) => (
          <MovieCard key={item.id} item={item} />
        ))}
      </div>

      {/* right arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 p-2 hidden group-hover:block"
      >
        <ChevronRight className="text-white" />
      </button>
    </div>
  );
};

export default RowCarousel;
