import { useEffect, useMemo, useRef, useState } from "react";
import { motion, type MotionProps, useInView } from "motion/react";
import { cn } from "../../lib/utils";

interface TypingAnimationProps extends MotionProps {
  children?: string;
  words?: string[];
  className?: string;
  duration?: number;
  typeSpeed?: number;
  deleteSpeed?: number;
  delay?: number;
  pauseDelay?: number;
  loop?: boolean;
  as?: React.ElementType;
  startOnView?: boolean;
  showCursor?: boolean;
  blinkCursor?: boolean;
  cursorStyle?: "line" | "block" | "underscore";
}

export function TypingAnimation({
  children,
  words,
  className,
  duration = 100,
  typeSpeed,
  deleteSpeed,
  delay = 0,
  pauseDelay = 1000,
  loop = false,
  as: Component = "span",
  startOnView = true,
  showCursor = true,
  blinkCursor = true,
  cursorStyle = "line",
  ...props
}: TypingAnimationProps) {
  const MotionComponent = motion.create(Component, {
    forwardMotionProps: true,
  });

  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pause" | "deleting">("typing");
  const elementRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(elementRef as React.RefObject<Element>, {
    amount: 0.1,
    once: true,
  });
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  const shouldStart = startOnView ? isInView || hasMounted : true;

  const wordsToAnimate = useMemo(
    () => words || (children ? [children] : []),
    [words, children],
  );
  const hasMultipleWords = wordsToAnimate.length > 1;

  const typingSpeed = typeSpeed || duration;
  const deletingSpeed = deleteSpeed || typingSpeed / 2;

  useEffect(() => {
    if (!shouldStart || wordsToAnimate.length === 0) return;

    // 1. Determine the correct speed based on current action
    let speed = typingSpeed;
    if (phase === "deleting") speed = deletingSpeed;
    if (phase === "pause") speed = pauseDelay;

    // 2. Add the initial start delay only on the very first character
    const finalDelay =
      displayedText === "" && phase === "typing" ? speed + delay : speed;

    const timeout = setTimeout(() => {
      const currentWord = wordsToAnimate[currentWordIndex] || "";
      const graphemes = Array.from(currentWord);

      if (phase === "typing") {
        if (currentCharIndex < graphemes.length) {
          setDisplayedText(graphemes.slice(0, currentCharIndex + 1).join(""));
          setCurrentCharIndex((prev) => prev + 1);
        } else {
          // Word finished
          if (hasMultipleWords || loop) {
            setPhase("pause");
          }
        }
      } else if (phase === "deleting") {
        if (currentCharIndex > 0) {
          setDisplayedText(graphemes.slice(0, currentCharIndex - 1).join(""));
          setCurrentCharIndex((prev) => prev - 1);
        } else {
          // Reset to next word
          const nextIndex = (currentWordIndex + 1) % wordsToAnimate.length;
          setCurrentWordIndex(nextIndex);
          setPhase("typing");
        }
      } else if (phase === "pause") {
        setPhase("deleting");
      }
    }, finalDelay);

    return () => clearTimeout(timeout);
  }, [
    shouldStart,
    phase,
    currentCharIndex,
    currentWordIndex,
    wordsToAnimate,
    loop,
  ]);

  const currentWordGraphemes = Array.from(
    wordsToAnimate[currentWordIndex] || "",
  );
  const isComplete =
    !loop &&
    currentWordIndex === wordsToAnimate.length - 1 &&
    currentCharIndex >= currentWordGraphemes.length &&
    phase !== "deleting";

  const shouldShowCursor =
    showCursor &&
    !isComplete &&
    (hasMultipleWords ||
      loop ||
      currentCharIndex < currentWordGraphemes.length);

  const getCursorChar = () => {
    switch (cursorStyle) {
      case "block":
        return "▌";
      case "underscore":
        return "_";
      case "line":
      default:
        return "|";
    }
  };

  return (
    <MotionComponent
      ref={elementRef}
      className={cn("leading-[5rem] tracking-[-0.02em]", className)}
      {...props}
    >
      {displayedText}
      {shouldShowCursor && (
        <span
          className={cn("inline-block", blinkCursor && "animate-blink-cursor")}
        >
          {getCursorChar()}
        </span>
      )}
    </MotionComponent>
  );
}
