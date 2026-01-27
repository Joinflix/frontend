import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type CreatePartyModalProps = {
  partyOpen: boolean;
  setPartyOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
};

const CreatePartyModal = ({
  partyOpen,
  setPartyOpen,
  title,
}: CreatePartyModalProps) => {
  return (
    <Dialog open={partyOpen} onOpenChange={setPartyOpen}>
      <DialogContent className="bg-black text-white border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-center">왓챠파티 시작하기</DialogTitle>
          <DialogDescription className="text-white/60">
            Start a watching party for "{title}"
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-white/80">
            Invite others to watch together.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setPartyOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-[#816BFF] hover:bg-[#816BFF]/80">
            Create Party
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePartyModal;
