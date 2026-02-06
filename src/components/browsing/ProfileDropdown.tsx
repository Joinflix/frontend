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

const ICON_STYLE = "text-white group-hover:text-black";

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
        <DropdownMenuContent className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 text-white rounded-xl mt-2 min-w-[130px]">
          <DropdownMenuGroup>
            <DropdownMenuItem className="group cursor-pointer">
              <UserRoundCog className={ICON_STYLE} /> 프로필 관리
            </DropdownMenuItem>
            <DropdownMenuItem className="group cursor-pointer">
              <MessageCircleQuestionMark className={ICON_STYLE} />
              고객센터
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-white/5" />
          <DropdownMenuGroup>
            <DropdownMenuItem className="group cursor-pointer text-white focus:text-black">
              <LogOut className={ICON_STYLE} />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
