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
import { useNavigate } from "react-router";
import type { PartyType } from "../../types/party";
import { partySchema, type PartyFormValues } from "../../schemas/partySchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";

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
  const navigate = useNavigate();
  const [partyType, setPartyType] = useState<PartyType>("PUBLIC");

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<PartyFormValues>({
    resolver: zodResolver(partySchema),
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: { name: "", password: "" },
  });

  const onSubmit = async (data: PartyFormValues) => {
    // /api/parties (POST)
    // *movieId, roomName, *isPublic, *hostControl, passCode
    fireConfetti();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // alert(data.name + " / " + data.password + " / " + data.hostControl);
    navigate(`/watch/party?title=${title}`);
  };

  const fireConfetti = () => {
    const end = Date.now() + 0.15 * 1000;
    const colors = ["#816BFF", "#FF3D81", "#00FFF0"];

    const frame = () => {
      if (Date.now() > end) return;

      const randomColor = () =>
        colors[Math.floor(Math.random() * colors.length)];

      const config = {
        particleCount: 10,
        spread: 70,
        startVelocity: 80,
        ticks: 300,
        gravity: 2.5,
        scalar: 1.2,
        shapes: ["square", "circle"],
      };

      confetti({
        ...config,
        angle: 60,
        origin: { x: 0, y: 0.8 },
        colors: [randomColor(), "#FFFFFF"],
      });

      confetti({
        ...config,
        angle: 120,
        origin: { x: 1, y: 0.8 },
        colors: [randomColor(), "#FFFFFF"],
      });
      requestAnimationFrame(frame);
    };
    frame();
  };

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
        <PartyForm
          partyType={partyType}
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
          touchedFields={touchedFields}
        />

        <DialogFooter className="flex !justify-center gap-3 mt-4">
          <Button className="bg-gray-700 hover:bg-gray-700/80 rounded-sm w-[50%]">
            예약하기
          </Button>
          <Button
            className="bg-[#816BFF] hover:bg-[#816BFF]/80 rounded-sm w-[50%]"
            onClick={handleSubmit(onSubmit)}
          >
            시작하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePartyModal;
