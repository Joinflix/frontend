import { Bell } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const ICON_STYLE = "w-5 h-5 stroke-white cursor-pointer";

export const AlertDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Bell className={ICON_STYLE} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 text-white rounded-xl min-w-[120px]">
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
              Team
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-white/5" />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
              Team
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
