import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import PartyTypeSelector from "./PartyTypeSelector";
import PartyForm from "./PartyForm";
import { useState } from "react";

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
  const [partyType, setPartyType] = useState<PartyType>("PUBLIC");

  return (
    <Dialog open={partyOpen} onOpenChange={setPartyOpen}>
      <DialogContent className="bg-black text-white border border-white/20 !max-w-sm px-10 py-9">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {title.toUpperCase()}
          </DialogTitle>
          <DialogDescription className="text-white text-center font-bold text-xl"></DialogDescription>
        </DialogHeader>

        <PartyTypeSelector value={partyType} onChange={setPartyType} />
        <PartyForm partyType={partyType} />

        <DialogFooter className="flex !justify-center gap-3 mt-4">
          <Button className="bg-gray-700 hover:bg-gray-700/80 rounded-sm w-[50%]">
            예약하기
          </Button>
          <Button className="bg-[#816BFF] hover:bg-[#816BFF]/80 rounded-sm w-[50%]">
            시작하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePartyModal;
