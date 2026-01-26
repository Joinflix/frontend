import BrowsingHeader from "../components/browsing/BrowsingHeader";
import BrowsingHero from "../components/browsing/BrowsingHero";
import Rank from "../components/browsing/Rank";

const BrowsingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <BrowsingHeader />
      <BrowsingHero
        title={"Steamboat Willie"}
        loopStart={25}
        loopEnd={35}
        imageSrc={"/images/steamboat-willie.webp"}
        titleSrc={"/images/steamboat-willie-title.webp"}
        videoSrc={"/videos/steamboat-willie_1928.mp4"}
        videoType={"video/mp4"}
        description={
          "The first Mickey Mouse cartoon released, and the first cartoon with synchronized sound. Mickey Mouse is a mischievous deckhand on a riverboat that is under the command of the tyrannical Captain Pete."
        }
      />
      <Rank />

      <div>hi</div>
    </div>
  );
};

export default BrowsingPage;
