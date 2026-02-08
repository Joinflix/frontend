import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import apiClient from "../../api/axios";

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
  const { data: movie, isPending: isPendingMovie } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: async () => {
      const res = await apiClient.get(`/movies/${movieId}`);
      return res.data;
    },
    enabled: !!movieId,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[50vw] md:max-w-2xl min-h-[80%] p-0! border-none!">
        {!isPendingMovie && (
          <>
            <img
              src={movie.backdrop}
              alt={movie.title}
              className="w-full h-[70%] object-fit object-top rounded-t-lg"
            ></img>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
            <DialogFooter>
              <DialogClose asChild></DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MovieDetailsDialog;
