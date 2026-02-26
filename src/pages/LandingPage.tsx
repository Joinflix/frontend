import LandingFooter from "../components/landing/LandingFooter";
import LandingHeader from "../components/landing/LandingHeader";
import LandingBody from "../components/landing/LandingBody";
import LandingMarquee from "../components/landing/LandingMarquee";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-[linear-gradient(rgba(0,0,0,0.9),rgba(0,0,0,0.5)),url('/public/images/landing_hero_background.jpg')]">
        <LandingHeader />
        <LandingBody />
        <LandingMarquee />
      </div>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
