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
            ? "border-1 border-[#816BFF] scale-105 bg-black"
            : "border border-[#816BFF]/30 opacity-60 hover:scale-105"
        }
      `}
    >
      <div className="flex justify-center py-2">
        {React.cloneElement(icon as React.ReactElement, {
          className: `size-12 transition-all duration-300 ${
            active
              ? "stroke-white/70 stroke-[0.07rem]"
              : "stroke-gray-400 stroke-[0.09rem]"
          }`,
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
