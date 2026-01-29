import BrowsingHeader from "../components/browsing/BrowsingHeader";
import BrowsingHero from "../components/browsing/BrowsingHero";
import Rank from "../components/browsing/Rank";
import RowCarousel from "../components/browsing/RowCarousel";

export const trendingMovies = [
  {
    id: 1,
    title: "Battleship Potemkin (1925)",
    poster:
      "https://m.media-amazon.com/images/M/MV5BZmY5ZGQwMTEtM2E0ZC00NzVkLTgyYzktZDYxMjhiMzA5N2MzXkEyXkFqcGc@._V1_FMjpg_UX857_.jpg",
    backdrop: "",
    description:
      "Sergei Eisenstein's revolutionary silent film that pioneered montage theory. The Odessa Steps sequence remains a masterclass in tension, rhythm, and political storytelling through editing, shaping how cinema conveys emotion and narrative.",
    video: "",
  },
  {
    id: 2,
    title: "Un Chien Andalou (1929)",
    poster:
      "https://m.media-amazon.com/images/M/MV5BNmIwNjhlZGMtN2JmNy00MmQ0LTljOGItYTNiMjI1ZWZlMGRiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    backdrop: "",
    description:
      "Luis Buñuel and Salvador Dalí's surrealist short film defies traditional narrative, creating dreamlike logic and shocking imagery. Its radical editing and symbolism reshaped the possibilities of visual storytelling.",
    video: "",
  },
  {
    id: 3,
    title: "Metropolis (1927)",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMjhjMGYyMjAtMzJkYy00NzhlLWIwY2MtMWQ2ODIxZDUyOGYyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    backdrop: "",
    description:
      "Fritz Lang's expressionist sci-fi epic set the standard for futuristic cityscapes and cinematic spectacle. Its monumental set design, social allegory, and visual effects influence filmmakers in both genre and art cinema.",
    video: "",
  },
  {
    id: 4,
    title: "Nosferatu (1922)",
    poster:
      "https://m.media-amazon.com/images/M/MV5BOWE0NjI3OWUtNDFhNS00MDY5LWJlNzctMmUwZDIxMGRjZGNlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    backdrop: "",
    description:
      "F.W. Murnau's unauthorized Dracula adaptation defined horror aesthetics with its haunting shadows and eerie atmosphere. The film's use of negative space, lighting, and camera movement remains essential for understanding visual storytelling in genre cinema.",
    video: "",
  },
  {
    id: 5,
    title: "The Phantom of the Opera (1925)",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMGE4MDQ0ZjEtMWIwNi00YWVlLTk3NTQtMzViMGRlYjA4NzdlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    backdrop: "",
    description:
      "Lon Chaney's legendary performance and makeup artistry brought horror and melodrama to vivid life. The film showcases early Hollywood spectacle, intricate set design, and expressionistic visuals, making it a masterclass in silent-era cinematic craft.",
    video: "",
  },
  {
    id: 6,
    title: "The General (1926)",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMTVhM2Y1MDUtMDkxYi00Y2UxLWI2MTMtZjMzYTY4ODM4MGIzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    backdrop: "",
    description:
      "Buster Keaton's silent comedy masterpiece blends physical stunts with precise visual storytelling. Renowned for its timing, spatial logic, and action choreography, it remains a benchmark for comedy, pacing, and cinematic ingenuity.",
    video: "",
  },
];

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
      <RowCarousel title="Trending Now" items={trendingMovies} />
      <Rank />

      <div>hi</div>
    </div>
  );
};

export default BrowsingPage;

// export const trendingMovies = [
//   {
//     id: 1,
//     title: "Interstellar",
//     poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
//     backdrop:
//       "https://image.tmdb.org/t/p/w1280/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
//     description:
//       "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
//     video: "https://www.w3schools.com/html/mov_bbb.mp4",
//   },
//   {
//     id: 2,
//     title: "Inception",
//     poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
//     backdrop:
//       "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
//     description:
//       "A thief who steals corporate secrets through dream-sharing technology.",
//     video: "https://www.w3schools.com/html/movie.mp4",
//   },
//   {
//     id: 3,
//     title: "The Dark Knight",
//     poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
//     backdrop:
//       "https://image.tmdb.org/t/p/w1280/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
//     description: "Batman faces the Joker in a battle for Gotham.",
//     video: "https://www.w3schools.com/html/mov_bbb.mp4",
//   },
//   {
//     id: 4,
//     title: "Avatar",
//     poster: "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
//     backdrop:
//       "https://image.tmdb.org/t/p/w1280/8I37NtDffNV7AZlDa7uDvvqhovU.jpg",
//     description:
//       "A marine on an alien planet becomes torn between duty and honor.",
//     video: "https://www.w3schools.com/html/movie.mp4",
//   },
//   {
//     id: 5,
//     title: "Parasite",
//     poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
//     backdrop:
//       "https://image.tmdb.org/t/p/w1280/ApiBzeaa95TNYliSbQ8pJv4Fje7.jpg",
//     description:
//       "A poor family schemes to become employed by a wealthy family.",
//     video: "https://www.w3schools.com/html/mov_bbb.mp4",
//   },
// ];
