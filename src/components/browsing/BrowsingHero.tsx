import { useState, useRef } from "react";

const BrowsingHero = ({
  title,
  loopStart,
  loopEnd,
  imageSrc,
  titleSrc,
  videoSrc,
  videoType,
  description,
}) => {
  const videoRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = loopStart;
    video.play();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = loopStart;
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.currentTime >= loopEnd) {
      video.currentTime = loopStart;
    }
  };

  const handleClickPlay = () => {
    alert(`play ${title}`);
  };

  return (
    <div
      className="relative w-full sm:h-[30vh] md:h-[50vh] lg:h-[70vh] xl:h-[80vh] rounded-lg overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* image */}
      <img
        src={imageSrc}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 z-10 ${
          isHovering ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* video */}
      <video
        ref={videoRef}
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={videoSrc} type={videoType} />
      </video>

      {/* gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent z-10"></div>

      {/* title */}
      <img
        className="absolute left-8 bottom-[40%] md:bottom-[45%] w-[150px] md:w-[300px] lg:w-[400px] z-20"
        src={titleSrc}
      />

      {/* description */}
      <div
        className="absolute left-8 sm:bottom-[30%] md:bottom-[25%] lg:bottom-[30%] md:text-xs lg:text-sm text-white z-20 w-[200px] md:w-[350px] lg:w-[450px] hidden md:block
  [text-shadow:0_2px_6px_rgba(0,0,0,0.9),0_6px_20px_rgba(0,0,0,0.8)]"
      >
        {description}
      </div>

      {/* play button */}
      <button
        className="absolute left-8 bottom-[15%] rounded-[0.3rem] md:bottom-[10%] lg:bottom-[20%] z-30 bg-white  hover:bg-white/70 font-bold md:rounded-sm px-5 py-1 text-sm md:px-7 md:py-1.5 md:text-base cursor-pointer transform hover:scale-110 transition-transform duration-200"
        onClick={handleClickPlay}
      >
        ▶ Play
      </button>
    </div>
  );
};

export default BrowsingHero;
