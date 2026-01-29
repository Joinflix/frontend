import ChatWindow from "../components/partyroom/chat/ChatWindow";

const PartyRoomPage = () => {
  return (
    <div className="flex h-screen">
      <div className="flex-1 flex items-center justify-center bg-black text-white">
        <video
          src="/public/videos/steamboat-willie_1928.mp4"
          className="object-contain w-full h-full max-h-screen max-w-screen"
          controls
        />
      </div>
      <ChatWindow />
    </div>
  );
};

export default PartyRoomPage;
