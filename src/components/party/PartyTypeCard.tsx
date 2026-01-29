import React from "react";

interface Props {
  title: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const PartyTypeCard = ({
  title,
  description,
  icon,
  active,
  onClick,
}: Props) => {
  return (
    <div
      onClick={onClick}
      className={`w-[50%] rounded-sm flex flex-col justify-center p-3 gap-1 cursor-pointer transition-all
        ${
          active
            ? "border-4 border-[#E6E0FF] scale-105"
            : "border border-[#816BFF]/30 opacity-60 hover:scale-105"
        }
      `}
      style={
        active
          ? {
              boxShadow: `
                0 0 10px #FFF,
                0 0 10px #816BFF,
                inset 0 0 10px #816BFF
              `,
            }
          : undefined
      }
    >
      <div className="flex justify-center py-2">
        {React.cloneElement(icon as React.ReactElement, {
          className: `size-20 transition-all duration-300 ${
            active
              ? "stroke-[#E6E0FF] stroke-[0.07rem]"
              : "stroke-gray-400 stroke-[0.09rem]"
          }`,
          style: active
            ? {
                filter:
                  "drop-shadow(0 0 2px #FFF) drop-shadow(0 0 6px #816BFF) drop-shadow(0 0 14px #816BFF)",
              }
            : undefined,
        })}
      </div>

      <h1 className="text-md font-bold text-center break-keep">{title}</h1>
      <span className="text-xs text-center break-keep text-white/70">
        {description}
      </span>
    </div>
  );
};

export default PartyTypeCard;
