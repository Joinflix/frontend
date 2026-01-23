import LandingFooter from "../components/landing/LandingFooter";
import LandingHero from "../components/landing/LandingHero";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHero />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
