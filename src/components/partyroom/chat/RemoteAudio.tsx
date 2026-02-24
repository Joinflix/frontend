import { useEffect, useRef } from "react";

interface RemoteAudioProps {
  stream: MediaStream;
  volume: number;
}

const RemoteAudio = ({ stream, volume }: RemoteAudioProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && stream) {
      audioRef.current.srcObject = stream;
    }
  }, [stream]); // Only re-run if the stream object actually changes

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]); // Update volume independently

  return <audio ref={audioRef} autoPlay playsInline />;
};

export default RemoteAudio;
