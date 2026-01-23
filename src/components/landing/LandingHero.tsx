import LandingBody from "./LandingHeroBody";
import LandingHeader from "./LandingHeader";

const LandingHero = () => {
  return (
    <div className="relative min-h-[80%]">
      <div className="absolute inset-0 bg-[url(/public/images/landing_hero_background.jpg)] bg-cover bg-center"></div>

      <div className="absolute inset-0 bg-black/75"></div>

      <div className="relative z-10">
        <LandingHeader />
        <LandingBody />
      </div>
    </div>
  );
};

export default LandingHero;
