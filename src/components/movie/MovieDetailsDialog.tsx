import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";
import apiClient from "../../api/axios";
import { ContactRound, MessageSquareMore, Play, Star } from "lucide-react";
import CreatePartyModal from "../party/CreatePartyDialog";
import { useState } from "react";

interface MovieDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  movieId: number | null;
}

const MovieDetailsDialog = ({
  isOpen,
  onOpenChange,
  movieId,
}: MovieDetailsDialogProps) => {
  const [partyOpen, setPartyOpen] = useState(false);

  const { data: movie, isPending: isPendingMovie } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: async () => {
      const res = await apiClient.get(`/movies/${movieId}`);
      return res.data;
    },
    enabled: !!movieId,
  });

  const handleClickPlay = (movieTitle: string) => {
    alert(`play ${movieTitle}`);
  };

  const handleClickParty = () => {
    setPartyOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogOverlay className="fixed inset-0 bg-black/80" />
        <DialogContent className="w-full max-w-[90%] max-h-[90%] md:max-w-2xl md:h-[80%] p-0! border-none! overflow-auto bg-black scrollbar-hidden">
          {!isPendingMovie && (
            <div>
              <DialogTitle className="sr-only">{movie.title}</DialogTitle>
              <div className="relative w-full h-[23%] md:h-[30%] rounded-t-lg overflow-hidden">
                <img
                  src={movie.backdrop}
                  alt={movie.title}
                  className="w-full h-full object-cover object-middle"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end px-10 pb-5 text-white">
                  {/* Button content */}
                  <div className="flex gap-4">
                    <button
                      className="rounded-[0.3rem] bg-white/80 hover:bg-white font-bold px-4 py-2 cursor-pointer transform hover:scale-110 transition-transform duration-200"
                      onClick={() => handleClickPlay(movie.title)}
                    >
                      <div className="flex items-center gap-1 text-xs py-0.5 text-black">
                        <Play className="size-3 fill-black" />
                        혼자 보기
                      </div>
                    </button>

                    <button
                      className="rounded-[0.3rem] bg-[#816BFF] text-white font-bold px-4 py-2 cursor-pointer border border-white transform transition-all duration-300 hover:scale-110 hover:bg-[#816BFF]/80 neon-glow neon-edge neon-btn"
                      onClick={handleClickParty}
                    >
                      <div className="flex items-center gap-1 neon-text text-xs">
                        <MessageSquareMore className="size-3 stroke-3" />
                        같이 보기
                      </div>

                      {/* glow layer */}
                      <span className="absolute inset-0 rounded-[0.3rem]bg-[#816BFF] blur-xl opacity-40-z-10" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-10">
                {/* Text content */}
                <div className="flex gap-2 items-center text-white mt-4">
                  <h2 className="text-xl font-bold">{movie.title}</h2>
                  <h2 className="text-xl font-bold flex items-center gap-1">
                    <Star className="fill-white w-5 h-5" />
                    3.5
                  </h2>
                </div>
                <div className="text-white text-sm mt-3">
                  {movie.description}
                </div>

                {/* Comments */}
                <div className="flex flex-col gap-3 mt-10">
                  {/* 코멘트1 */}
                  <div className="flex flex-col gap-3 bg-white/10 p-3 rounded-md text-white">
                    {/* 메타데이터 */}
                    <div className="flex items-center gap-2">
                      <ContactRound className="size-5" />
                      <div className="text-sm tracking-tight">유저닉네임1</div>
                      <div className="flex">
                        <Star className="w-4 h-4 stroke-[#816BFF] fill-[#816BFF]" />
                        <Star className="w-4 h-4 stroke-[#816BFF] fill-[#816BFF]" />
                        <Star className="w-4 h-4 stroke-[#816BFF] fill-[#816BFF]" />
                        <Star className="w-4 h-4 stroke-[#816BFF] fill-[#816BFF]" />
                        <Star className="w-4 h-4 stroke-[#816BFF] fill-[#816BFF]" />
                      </div>
                    </div>
                    {/* 코멘트 내용 */}
                    <div className="text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Donec egestas turpis ac ipsum sollicitudin feugiat. Donec
                      volutpat velit ut ex elementum sagittis. Sed neque ligula,
                      semper id accumsan in, viverra sed nisl. Donec cursus id
                      nisl sit amet laoreet.
                    </div>
                  </div>

                  {/* 코멘트2 */}
                  <div className="flex flex-col gap-3 bg-white/10 p-3 rounded-md text-white">
                    {/* 메타데이터 */}
                    <div className="flex items-center gap-2">
                      <ContactRound className="size-5" />
                      <div className="text-sm tracking-tight">유저닉네임2</div>
                      <div className="flex">
                        <Star className="w-4 h-4 stroke-[#816BFF] fill-[#816BFF]" />
                        <Star className="w-4 h-4 stroke-[#816BFF] fill-[#816BFF]" />
                      </div>
                    </div>
                    {/* 코멘트 내용 */}
                    <div className="text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Donec egestas turpis ac ipsum sollicitudin feugiat. Donec
                      volutpat velit ut ex elementum sagittis. Sed neque ligula,
                      semper id accumsan in, viverra sed nisl. Donec cursus id
                      nisl sit amet laoreet.
                    </div>
                  </div>

                  {/* 코멘트3 */}
                  <div className="flex flex-col gap-3 bg-white/10 p-3 rounded-md text-white">
                    {/* 메타데이터 */}
                    <div className="flex items-center gap-2">
                      <ContactRound className="size-5" />
                      <div className="text-sm tracking-tight">유저닉네임3</div>
                      <div className="flex">
                        <Star className="w-4 h-4 stroke-[#816BFF] fill-[#816BFF]" />
                      </div>
                    </div>
                    {/* 코멘트 내용 */}
                    <div className="text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Donec egestas turpis ac ipsum sollicitudin feugiat. Donec
                      volutpat velit ut ex elementum sagittis. Sed neque ligula,
                      semper id accumsan in, viverra sed nisl. Donec cursus id
                      nisl sit amet laoreet.
                    </div>
                  </div>

                  {/* 코멘트4 */}
                  <div className="flex flex-col gap-3 bg-white/10 p-3 rounded-md text-white">
                    {/* 메타데이터 */}
                    <div className="flex items-center gap-2">
                      <ContactRound className="size-5" />
                      <div className="text-sm tracking-tight">유저닉네임4</div>
                      <div className="flex">
                        <Star className="w-4 h-4 stroke-[#816BFF] fill-[#816BFF]" />
                        <Star className="w-4 h-4 stroke-[#816BFF] fill-[#816BFF]" />
                        <Star className="w-4 h-4 stroke-[#816BFF] fill-[#816BFF]" />
                        <Star className="w-4 h-4 stroke-[#816BFF] fill-[#816BFF]" />
                      </div>
                    </div>
                    {/* 코멘트 내용 */}
                    <div className="text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Donec egestas turpis ac ipsum sollicitudin feugiat. Donec
                      volutpat velit ut ex elementum sagittis. Sed neque ligula,
                      semper id accumsan in, viverra sed nisl. Donec cursus id
                      nisl sit amet laoreet.
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild></DialogClose>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CreatePartyModal
        partyOpen={partyOpen}
        setPartyOpen={setPartyOpen}
        title={"title"}
        movieId={movieId}
      />
    </>
  );
};

export default MovieDetailsDialog;
