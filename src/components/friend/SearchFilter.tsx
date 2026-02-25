import { ChevronDown, CircleX, Search } from "lucide-react";

interface SearchFilterProps {
  primary: PrimaryFilter;
  setPrimary: (val: PrimaryFilter) => void;
  secondary: string;
  setSecondary: (val: string) => void;
  searchWord: string;
  setSearchWord: (val: string) => void;
}

export type PrimaryFilter = "ALL" | "FRIEND" | "EMAIL" | "NICKNAME";

const SECONDARY_OPTIONS = {
  FRIEND: [
    { label: "전체", value: "ALL" },
    { label: "친구", value: "FRIEND" },
    { label: "대기중", value: "PENDING" },
    { label: "신청 받음", value: "REQUESTED" },
  ],
  EMAIL: [
    { label: "정렬 방식", value: "ALL" },
    { label: "오름차순 ↑", value: "EMAIL_ASC" },
    { label: "내림차순 ↓", value: "EMAIL_DESC" },
  ],
  NICKNAME: [
    { label: "정렬 방식", value: "ALL" },
    { label: "오름차순 ↑", value: "NICKNAME_ASC" },
    { label: "내림차순 ↓", value: "NICKNAME_DESC" },
  ],
};

const SearchFilter = ({
  primary,
  setPrimary,
  secondary,
  setSecondary,
  searchWord,
  setSearchWord,
}: SearchFilterProps) => {
  return (
    <div className="flex flex-row items-center gap-2 mt-4 w-full">
      {/* Search Bar - Stretches to fill space */}
      <div className="relative flex-1 group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[#816BFF]">
          <Search size={18} />
        </div>
        <input
          className="w-full h-11 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#816BFF]/40 transition-all hover:bg-white/10"
          placeholder="닉네임 혹은 이메일로 검색"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
        />
        {searchWord && (
          <button
            className="absolute inset-y-0 right-4 flex items-center text-zinc-500 hover:text-white transition-colors"
            onClick={() => setSearchWord("")}
          >
            <CircleX size={16} />
          </button>
        )}
      </div>

      {/* Primary Category Select */}
      <div className="relative flex items-center h-11 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all focus-within:ring-2 focus-within:ring-[#816BFF]/40 shrink-0 group">
        {/* 1. The Visual Layer: This is what the user SEES */}
        <div className="flex items-center w-full h-full pointer-events-none">
          <span className="pl-4 pr-1 text-xs font-medium text-zinc-300">
            {primary === "ALL"
              ? "전체"
              : primary === "FRIEND"
                ? "친구"
                : primary === "EMAIL"
                  ? "이메일"
                  : "닉네임"}
          </span>
          <div className="pr-3 flex items-center ml-auto">
            <ChevronDown
              size={14}
              className="text-zinc-500 group-hover:text-zinc-300 transition-colors"
            />
          </div>
        </div>

        {/* 2. The Interaction Layer: The actual select, invisible but covering the whole div */}
        <select
          value={primary}
          onChange={(e) => {
            const val = e.target.value as PrimaryFilter;
            setPrimary(val);
            setSecondary("ALL");
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none"
        >
          <option value="ALL">전체</option>
          <option value="FRIEND">친구</option>
          <option value="EMAIL">이메일</option>
          <option value="NICKNAME">닉네임</option>
        </select>
      </div>

      {/* Secondary Dynamic Select - Rendered only when Primary isn't 'ALL' */}
      {primary !== "ALL" && (
        <div className="flex items-center justify-between h-11 bg-[#816BFF]/10 border border-[#816BFF]/30 rounded-xl hover:bg-[#816BFF]/20 transition-all focus-within:ring-2 focus-within:ring-[#816BFF]/40">
          <select
            value={secondary}
            onChange={(e) => setSecondary(e.target.value)}
            className="appearance-none h-full bg-transparent px-4 text-xs font-semibold text-[#A89AFF] cursor-pointer focus:outline-none text-center"
          >
            {SECONDARY_OPTIONS[primary as keyof typeof SECONDARY_OPTIONS].map(
              (opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-zinc-900 text-white"
                >
                  {opt.label}
                </option>
              ),
            )}
          </select>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
