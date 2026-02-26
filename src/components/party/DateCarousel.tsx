import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Day } from "../../types/days";

interface DateCarouselProps {
  availableDays: Day[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export const DateCarousel = ({
  availableDays,
  selectedDate,
  setSelectedDate,
}: DateCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest", // Avoid vertical jumping of the whole page
        inline: "center", // This centers the element in the carousel
      });
    }
  }, [selectedDate]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    // We scroll by one full "view" (4 items)
    const scrollAmount = scrollRef.current.offsetWidth;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full mt-2 group">
      {/* Left Arrow - Smaller and sleek for the Dialog context */}
      <button
        onClick={() => scroll("left")}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-zinc-900/90 border border-white/10 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        <ChevronLeft size={16} className="text-white" />
      </button>

      {/* The Row */}
      <div
        ref={scrollRef}
        className="flex gap-x-2 overflow-x-auto pb-2 scrollbar-hidden snap-x snap-mandatory"
      >
        {availableDays.map((day) => {
          const isSelected = selectedDate === day.fullDate;
          return (
            <button
              key={day.fullDate}
              ref={isSelected ? selectedRef : null}
              onClick={() => setSelectedDate(day.fullDate)}
              className={`flex flex-col items-center justify-center min-w-[calc(25%-6px)] py-6 rounded-xl border transition-all snap-center cursor-pointer
                ${
                  isSelected
                    ? "bg-[#816BFF] border-[#816BFF] text-white shadow-lg shadow-[#816BFF]/20"
                    : "bg-zinc-800 border-white/5 text-zinc-400 hover:border-white/20"
                }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span
                  className={`text-[10px] font-medium leading-none ${isSelected ? "text-white/80" : "text-zinc-500"}`}
                >
                  {day.dayName}
                </span>
                <span className="text-base font-bold leading-none">
                  {day.dayNum}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-zinc-900/90 border border-white/10 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        <ChevronRight size={16} className="text-white" />
      </button>
    </div>
  );
};
