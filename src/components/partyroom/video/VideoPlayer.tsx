import { ArrowLeft } from "lucide-react";
import type { RefObject } from "react";
import type { PartyRoomData } from "../../../types/party";

interface VideoPlayerProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  partyRoomData: PartyRoomData;
  isHost: boolean;
  onClickBack: () => void;
}

const VideoPlayer = ({
  videoRef,
  partyRoomData,
  isHost,
  onClickBack,
}: VideoPlayerProps) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-black text-white transition-all duration-300">
      <div className="absolute top-4 left-4 z-10  px-3 py-1 ">
        {/* Header Overlay */}
        <div className="flex items-center gap-1">
          <ArrowLeft
            size={20}
            className="cursor-pointer top-4 left-4 z-10 hover:scale-120 transition-transform stroke-3"
            onClick={onClickBack}
          />
          <span className="pointer-events-none">
            {partyRoomData.movieTitle}
          </span>
        </div>
      </div>

      <video
        ref={videoRef}
        //TODO: DB에 각 영상 주소 저장 후 partyRoomData에서 동적으로 주소 가져오기
        src="https://joinflix-s3-bucket.s3.ap-northeast-2.amazonaws.com/videos/steamboat-willie_1928.mp4"
        className="object-contain w-full h-full max-h-screen max-w-screen"
        controls={isHost || !partyRoomData.hostControl}
      />
    </div>
  );
};

export default VideoPlayer;
