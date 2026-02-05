import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOut, MessageCircleQuestionMark, UserRoundCog } from "lucide-react";

export const ProfileDropdown = ({ iconStyle }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <div className={`${iconStyle} bg-white ml-2 rounded-sm`} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 text-white rounded-xl mt-2 min-w-[160px]">
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <UserRoundCog /> 프로필 관리
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <MessageCircleQuestionMark />
              고객센터
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-white/5" />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer text-white focus:text-black">
              <LogOut />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
