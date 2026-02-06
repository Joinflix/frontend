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
import { fireConfetti } from "../../utils/fireConfetti";
import apiClient from "../../api/axios";
import { useMutation } from "@tanstack/react-query";

type CreatePartyModalProps = {
  partyOpen: boolean;
  setPartyOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  movieId: number;
};

const CreatePartyModal = ({
  partyOpen,
  setPartyOpen,
  title,
  movieId,
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

  const { mutate: joinParty } = useMutation({
    mutationKey: ["joinParty"],
    mutationFn: async ({
      partyId,
      passCode,
    }: {
      partyId: number;
      passCode?: string;
    }) => {
      const res = await apiClient.post(`/parties/${partyId}/join`, {
        passCode,
      });
      return res.data;
    },
    onSuccess: (data) => {
      fireConfetti();
      setTimeout(() => {
        setPartyOpen(false);
        navigate(`/watch/party/${data.partyId}`, {
          state: { partyData: data },
        });
      }, 1000);
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  const onSubmit = async (data: PartyFormValues) => {
    try {
      const payload = {
        roomName: data.name,
        passCode: partyType === "PRIVATE" ? data.password : null,
        isPublic: partyType === "PRIVATE" ? false : true,
        partyType: partyType,
        movieId,
        hostControl: data.hostControl,
      };
      // TODO: movie id 업데이트 필요

      const partyResponse = await apiClient.post<number>("/parties", payload);
      const newPartyId = partyResponse.data;

      joinParty({ partyId: newPartyId, passCode: data.password });
    } catch (error) {
      console.error("Failed to create party room:", error);
      // TODO: alert message 보여주기
    }
  };

  return (
    <Dialog open={partyOpen} onOpenChange={setPartyOpen}>
      <DialogContent className="bg-zinc-900 text-white border border-white/20 !max-w-105 px-13 py-10">
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
          <Button className="bg-zinc-700 hover:bg-zinc-700/80 rounded-sm w-[50%]">
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
