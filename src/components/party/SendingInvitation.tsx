import React, { forwardRef, useRef } from "react";
import { cn } from "../../lib/utils";
import { AnimatedBeam } from "../ui/animated-beam";
import { useAuthStore } from "../../store/useAuthStore";

const SENDER_NAME_CIRCLE_STYLE =
  "bg-[#816BFF] border-none font-extrabold size-10";
const RECEIVER_NAME_CIRCLE_STYLE =
  "bg-[#816BFF] border-none font-extrabold size-5 text-xs";
const LOGO_CIRCLE_STYLE = "border-none bg-transparent";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export function SendingInvitation({
  className,
  receiverList,
}: {
  className?: string;
  receiverList: any[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const receiverRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [mounted, setMounted] = React.useState(false);

  const { nickname } = useAuthStore((state) => state.user?.nickName);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full items-center justify-center overflow-hidden p-10",
        className,
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center">
          <Circle className={SENDER_NAME_CIRCLE_STYLE} ref={div7Ref}>
            {nickname?.charAt(0)} Z
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className={`size-16 ${LOGO_CIRCLE_STYLE}`}>
            <img
              src="/logo/joinflix-icon-img.png"
              alt="joinflix"
              className="scale-150"
            />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-2">
          {receiverList.map((receiver, index) => (
            <div className="flex items-center gap-2">
              <Circle
                key={receiver.id}
                className={RECEIVER_NAME_CIRCLE_STYLE}
                ref={(el) => (receiverRefs.current[index] = el)}
              >
                {receiver.nickname?.charAt(0)}
              </Circle>
              <span className="text-white text-xs">{receiver.nickname}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AnimatedBeams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div6Ref}
        duration={4}
        pathWidth={4}
      />
      {mounted &&
        receiverList.map((_, index) => {
          const element = receiverRefs.current[index];
          if (!element) return null;

          return (
            <AnimatedBeam
              key={index}
              containerRef={containerRef}
              fromRef={div6Ref}
              toRef={{ current: element }}
            />
          );
        })}
    </div>
  );
}
