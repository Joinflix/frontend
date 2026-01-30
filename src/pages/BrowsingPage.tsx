import BrowsingHeader from "../components/browsing/BrowsingHeader";
import BrowsingHero from "../components/browsing/BrowsingHero";
import Rank from "../components/browsing/Rank";
import RowCarousel from "../components/browsing/RowCarousel";
import { cinemaClassics } from "../data/cinemaClassics";

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
          "미키 마우스가 처음으로 스크린에 등장한 역사적인 작품이자 영상과 사운드를 완벽하게 결합한 최초의 애니메이션. 증기선을 배경으로 미키 마우스는 피트 선장이 이끄는 배에서 장난기 넘치고 재치 있는 선원으로 등장해 특유의 유쾌한 매력으로 잊을 수 없는 모험을 펼친다."
        }
      />
      <RowCarousel title="Cinema Classics" items={cinemaClassics} />
      <Rank />

      <div>hi</div>
    </div>
  );
};

export default BrowsingPage;
