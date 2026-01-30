import confetti from "canvas-confetti";

export const fireConfetti = () => {
  const end = Date.now() + 0.15 * 1000;
  const colors = ["#816BFF", "#FF3D81", "#00FFF0"];

  const frame = () => {
    if (Date.now() > end) return;

    const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

    const config = {
      particleCount: 30,
      spread: 70,
      startVelocity: 80,
      ticks: 300,
      gravity: 2.5,
      scalar: 1.2,
      shapes: ["square", "circle"],
    };

    confetti({
      ...config,
      angle: 60,
      origin: { x: 0, y: 0.8 },
      colors: [randomColor(), "#FFFFFF"],
    });

    confetti({
      ...config,
      angle: 120,
      origin: { x: 1, y: 0.8 },
      colors: [randomColor(), "#FFFFFF"],
    });
    requestAnimationFrame(frame);
  };
  frame();
};
