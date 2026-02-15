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
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CircleX,
  ContactRound,
  DoorOpen,
  Mail,
  Search,
  Send,
  Undo2,
  X,
} from "lucide-react";
import { SendingInvitation } from "./SendingInvitation";
import { AnimatedGradientText } from "../ui/animated-gradient-text";

type CreatePartyDialogProps = {
  partyOpen: boolean;
  setPartyOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  movieId: number;
};

type DialogStep = "FORM" | "INVITE";

const profileImageUrl = "";

const CreatePartyDialog = ({
  partyOpen,
  setPartyOpen,
  title,
  movieId,
}: CreatePartyDialogProps) => {
  const navigate = useNavigate();
  const [partyType, setPartyType] = useState<PartyType>("PUBLIC");
  const [step, setStep] = useState<DialogStep>("FORM");

  const [searchWord, setSearchWord] = useState<string | undefined>();
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);

  const [pendingPrivateData, setPendingPrivateData] =
    useState<PartyFormValues | null>(null);

  const dialogWidth = step === "INVITE" ? "md:min-w-3xl" : "max-w-md";

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<PartyFormValues>({
    resolver: zodResolver(partySchema),
    mode: "onChange",
    shouldUnregister: true,
    reValidateMode: "onBlur",
    defaultValues: { name: "", password: "", hostControl: true },
  });

  const {
    mutate: joinParty,
    isPending: joinPartyIsPending,
    isSuccess: joinPartyIsSuccess,
  } = useMutation({
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
        navigate(`/watch/party/${data.id}`, {
          state: { partyData: data },
        });
      }, 1000);
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  const {
    mutate: createParty,
    isPending: createPartyIsPending,
    isSuccess: createPartyIsSuccess,
  } = useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.post<number>("/parties", payload);
      return res.data;
    },
    onSuccess: (partyId, variables) => {
      joinParty({ partyId, passCode: variables.passCode });
    },
    onError: (error) => {
      console.error("Failed to create party", error);
    },
  });

  const onSubmit = (data: PartyFormValues) => {
    const isPrivate = partyType === "PRIVATE";

    if (!isPrivate) {
      const payload = {
        roomName: data.name,
        passCode: null,
        isPublic: true,
        partyType,
        movieId,
        hostControl: false,
        invitedUserIds: [],
      };
      createParty(payload);
      return;
    }
    setPendingPrivateData(data);
    setStep("INVITE");
  };

  const toggleFriend = (friendId: number) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId],
    );
  };

  const { data: friends, isPending } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const res = await apiClient.get(`/friends`);
      return res.data;
    },
  });

  const selectedFriendObjects =
    friends?.filter((friend) => selectedFriends.includes(friend.userId)) ?? [];

  const handleClickStartPrivateParty = () => {
    if (!pendingPrivateData) return;

    const payload = {
      roomName: pendingPrivateData.name,
      passCode: pendingPrivateData.password,
      isPublic: false,
      partyType,
      movieId,
      hostControl: !!pendingPrivateData.hostControl,
      invitedUserIds: selectedFriends,
    };

    createParty(payload);
  };

  const isWorking =
    (createPartyIsPending ||
      joinPartyIsPending ||
      createPartyIsSuccess ||
      joinPartyIsSuccess) &&
    partyType === "PRIVATE";

  return (
    <Dialog
      open={partyOpen}
      onOpenChange={(open) => {
        setPartyOpen(open);
        if (!open) setStep("FORM");
      }}
    >
      <DialogContent
        className={`bg-zinc-900 text-white border border-white/20 sm:w-105! px-13 py-10 ${dialogWidth}`}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {title.toUpperCase()}
          </DialogTitle>
          <DialogDescription className="text-white text-center font-bold text-xl"></DialogDescription>
        </DialogHeader>

        {step === "FORM" ? (
          /* STEP 1: FORM VIEW */
          <>
            <PartyTypeSelector value={partyType} onChange={setPartyType} />
            <PartyForm
              partyType={partyType}
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
              touchedFields={touchedFields}
            />

            <DialogFooter className="flex justify-center! gap-3 mt-4">
              <Button className="bg-zinc-700 hover:bg-zinc-700/80 rounded-sm sm:w-[50%]">
                예약하기
              </Button>
              <Button
                className="bg-[#816BFF] hover:bg-[#816BFF]/80 rounded-sm sm:w-[50%]"
                onClick={handleSubmit(onSubmit)}
              >
                {partyType === "PRIVATE" ? "초대하기" : "시작하기"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          /* STEP 2: 초대 UI */

          <div className="flex flex-col gap-6">
            {/* Organic Search Bar */}
            <div className="relative flex items-center group">
              <div className="absolute left-4 text-zinc-500 transition-colors group-focus-within:text-[#816BFF]">
                <Search size={18} />
              </div>
              <input
                className="w-full bg-white/5 border border-white/5 rounded-lg py-3 pl-11 pr-11 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#816BFF]/50 transition-all"
                type="text"
                placeholder="닉네임 혹은 이메일로 검색"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
              />
              {searchWord && (
                <button
                  className="absolute right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  onClick={() => setSearchWord("")}
                >
                  <CircleX size={18} />
                </button>
              )}
            </div>

            <div className="min-h-[200px] max-h-[300px] grid grid-cols-1 md:grid-cols-2 md:gap-x-20 items-center justify-center overflow-auto">
              {friends.map((friend) => {
                const isSelected = selectedFriends.includes(friend.userId);

                return (
                  <div
                    key={friend.userId}
                    className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-all duration-300 group gap-4 cursor-pointer"
                    onClick={() =>
                      !createPartyIsPending &&
                      !joinPartyIsPending &&
                      toggleFriend(friend.userId)
                    }
                  >
                    <div className="flex gap-3 items-center min-w-0">
                      <div className="flex-shrink-0">
                        {profileImageUrl ? (
                          <img
                            src={profileImageUrl}
                            className="w-10 h-10 rounded-full object-cover border border-white/10"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-zinc-700/50 flex items-center justify-center rounded-full border border-white/5">
                            <ContactRound size={20} className="text-zinc-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm text-zinc-100 font-semibold">
                          {friend.nickname}
                        </span>
                        <span className="text-xs text-zinc-500 truncate">
                          {friend.email}
                        </span>
                      </div>
                    </div>
                    <button
                      className={`flex-shrink-0 flex items-center gap-1 px-2 py-1.5 rounded-sm text-[11px] font-bold transition-all duration-300 border backdrop-blur-md active:scale-95
                  ${
                    isSelected
                      ? "bg-[#816BFF] border-[#816BFF] text-white"
                      : "bg-[#816BFF]/40 border-[#816BFF] text-white hover:bg-[#816BFF]"
                  }
                  ${createPartyIsPending || joinPartyIsPending ? "cursor-none" : "cursor-pointer"}`}
                    >
                      {isSelected ? (
                        <div className="flex gap-1">
                          <Undo2 size={14} />
                          <span>취소</span>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <Mail size={14} />
                          <span>초대</span>
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {selectedFriendObjects.length > 0 && (
              <div className="w-full bg-zinc-800/60 min-h-[20px] rounded-lg p-3 flex flex-wrap gap-2 items-center">
                <span className="text-sm mx-2">
                  {selectedFriendObjects.length}명
                </span>
                {selectedFriendObjects.map((friend) => (
                  <div
                    key={friend.userId}
                    className={`px-2 py-1 bg-[#816BFF]/20 border border-[#816BFF] text-xs rounded-full text-white flex items-center gap-0.5 ${createPartyIsPending || joinPartyIsPending ? "cursor-none" : "cursor-pointer"}`}
                    onClick={() => {
                      if (createPartyIsPending || joinPartyIsPending) return;
                      toggleFriend(friend.userId);
                    }}
                  >
                    {friend.nickname}
                    <X size={10} className="stroke-4 stroke-zinc-300" />
                  </div>
                ))}
              </div>
            )}

            <Button
              disabled={selectedFriends.length === 0 || isWorking}
              className="bg-[#816BFF] hover:bg-[#816BFF]/80 rounded-sm w-full"
              onClick={handleClickStartPrivateParty}
            >
              {createPartyIsPending ? (
                <div className="flex items-center gap-2">
                  <Send size={18} />
                  <span>초대장 발송 중</span>
                </div>
              ) : joinPartyIsPending || joinPartyIsSuccess ? (
                <div className="flex items-center gap-2">
                  <DoorOpen size={18} />
                  <span>파티 입장 중</span>
                </div>
              ) : (
                "시작하기"
              )}
            </Button>
          </div>
        )}
        {isWorking && (
          <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
            <AnimatedGradientText
              speed={1}
              colorFrom="#816BFF"
              colorTo="#0000"
              className="text-lg pt-10 pb-0 font-semibold tracking-tight"
            >
              친구들에게 초대장 전송 중...
            </AnimatedGradientText>
            <SendingInvitation receiverList={selectedFriendObjects} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePartyDialog;
