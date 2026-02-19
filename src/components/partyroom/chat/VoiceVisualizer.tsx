import { useEffect, useState } from "react";

const VoiceVisualizer = ({ stream }: { stream: MediaStream | null }) => {
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (!stream || stream.getAudioTracks().length === 0) return;

    const audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();

    // Resume context if browser suspended it
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    // This makes the transition between heights smoother
    analyser.smoothingTimeConstant = 0.5;
    analyser.fftSize = 64;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let animationId: number;

    const animate = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setLevel(average);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      audioContext.close();
    };
  }, [stream]);

  // Lower threshold so it picks up whispers, but ignores dead silence
  const isSpeaking = level > 3;

  return (
    <div className="flex items-center gap-[3px] h-5 px-1">
      {[0.5, 1, 0.7].map((multiplier, i) => {
        // We calculate height as a percentage of the parent container (h-5)
        // level / 50 means '50' is our "max" volume target.
        const calculatedHeight = isSpeaking
          ? Math.min(100, (level / 50) * 100 * multiplier)
          : 20;

        return (
          <div
            key={i}
            className={`w-[3px] rounded-full transition-all duration-100 ease-in-out ${
              isSpeaking
                ? "bg-[#816BFF] shadow-[0_0_8px_rgba(129,107,255,0.6)]"
                : "bg-zinc-700/50"
            }`}
            style={{
              height: `${calculatedHeight}%`,
            }}
          />
        );
      })}
    </div>
  );
};

export default VoiceVisualizer;
