import { ContactRound } from "lucide-react";
import FriendActionButton from "./FriendActionButton";
import type { Friend } from "./FriendSearchDialog";

interface UserListProps {
  user: Friend;
  onRequest: () => void;
  onRemove: () => void;
  onAccept: () => void;
  onRefuse: () => void;
}

const UserList = ({
  user,
  onRequest,
  onRemove,
  onAccept,
  onRefuse,
}: UserListProps) => (
  <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-all duration-300 group">
    <div className="flex gap-3 items-center">
      <div className="relative">
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            className="w-10 h-10 rounded-full object-cover border border-white/10"
          />
        ) : (
          <div className="w-10 h-10 bg-zinc-700/50 flex items-center justify-center rounded-full border border-white/5">
            <ContactRound size={20} className="text-zinc-500" />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-zinc-100 font-semibold">
          {user.nickname}
        </span>
        <span className="text-xs text-zinc-500">{user.email}</span>
      </div>
    </div>

    <FriendActionButton
      status={user.status}
      onRequest={onRequest}
      onRemove={onRemove}
      onAccept={onAccept}
      onRefuse={onRefuse}
    />
  </div>
);

export default UserList;
