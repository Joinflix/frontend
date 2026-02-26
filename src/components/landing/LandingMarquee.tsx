import { cinemaClassics } from "../../data/cinemaClassics";
import { Marquee } from "../ui/marquee";

const LandingMarquee = () => {
  return (
    <Marquee pauseOnHover className="[--duration:100s] mb-10">
      <div className="flex flex-row gap-4 mt-10 mb-20">
        {cinemaClassics.map((movie) => (
          <div
            key={movie.id}
            className="shrink-0 w-30 h-40 overflow-hidden rounded-xs border border-white"
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
        ))}
      </div>
    </Marquee>
  );
};

export default LandingMarquee;
