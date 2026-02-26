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
import { useMemo, useState } from "react";
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
import { DateCarousel } from "./DateCarousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// TODO: Check if partyType is necessary (BE에는 없는 필드임)
// PartyRoomRequest(BE)
interface CreatePartyPayload {
  movieId: number;
  roomName: string;
  isPublic: boolean;
  hostControl: boolean;
  passCode: string | null | undefined;
  invitedUserIds: number[];
  partyType: PartyType;
}

//FriendResponse(BE)
interface Friend {
  userId: number;
  nickname: string;
  email: string;
}

type CreatePartyDialogProps = {
  partyOpen: boolean;
  setPartyOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  movieId: number;
};

type DialogStep = "FORM" | "INVITE" | "RESERVE";

const profileImageUrl = "";

const hours = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
const minutes = ["00", "30"];

const selectStyles =
  "flex-1 bg-zinc-800 border border-white/10 rounded-sm p-2 px-7 text-white outline-none focus:ring-2 focus:ring-[#816BFF] appearance-none cursor-pointer";

const CreatePartyDialog = ({
  partyOpen,
  setPartyOpen,
  title,
  movieId,
}: CreatePartyDialogProps) => {
  const navigate = useNavigate();
  const [partyType, setPartyType] = useState<PartyType>("PUBLIC");
  const [step, setStep] = useState<DialogStep>("FORM");

  const [searchWord, setSearchWord] = useState<string>("");
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);

  const [pendingPrivateData, setPendingPrivateData] =
    useState<PartyFormValues | null>(null);

  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");

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
      passCode?: string | null | undefined;
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
          state: { partyRoomData: data },
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
    mutationFn: async (payload: CreatePartyPayload) => {
      const res = await apiClient.post<number>("/parties", payload);
      return res.data;
    },
    onSuccess: (partyId, variables) => {
      joinParty({ partyId, passCode: variables.passCode });
    },
    onError: (error) => {
      alert(error.response?.data?.message);
      if (error.response?.data?.code === "MEMBERSHIP_REQUIRED")
        navigate("/signup/step4-list-membership");
    },
  });

  const onSubmit = (data: PartyFormValues) => {
    const isPrivate = partyType === "PRIVATE";

    if (!isPrivate) {
      const payload = {
        movieId,
        roomName: data.name,
        isPublic: true,
        hostControl: false,
        passCode: null,
        invitedUserIds: [],
        partyType,
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

  const { data: friends = [], isPending } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const res = await apiClient.get(`/friends`);
      return res.data;
    },
  });

  const filteredFriends = useMemo(() => {
    if (!searchWord.trim()) return friends;

    const searchTerm = searchWord.toLowerCase();
    return friends.filter(
      (friend: Friend) =>
        friend.nickname.toLowerCase().includes(searchTerm) ||
        friend.email.toLowerCase().includes(searchTerm),
    );
  }, [friends, searchWord]);

  const selectedFriendObjects =
    friends?.filter((friend: Friend) =>
      selectedFriends.includes(friend.userId),
    ) ?? [];

  const handleClickStartPrivateParty = () => {
    if (!pendingPrivateData) return;

    const payload = {
      movieId,
      roomName: pendingPrivateData.name,
      isPublic: false,
      hostControl: !!pendingPrivateData.hostControl,
      passCode: pendingPrivateData.password,
      invitedUserIds: selectedFriends,
      partyType,
    };

    createParty(payload);
  };

  const isWorking =
    (createPartyIsPending ||
      joinPartyIsPending ||
      createPartyIsSuccess ||
      joinPartyIsSuccess) &&
    partyType === "PRIVATE";

  const getNextSevenDays = () => {
    const days = [];
    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      days.push({
        fullDate: date.toISOString().split("T")[0], // "2024-05-20"
        dayNum: date.getDate(), // 20
        dayName: i === 0 ? "오늘" : weekDays[date.getDay()], // "오늘", "월", etc.
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      });
    }
    return days;
  };

  const availableDays = getNextSevenDays();
  const [selectedDate, setSelectedDate] = useState(availableDays[0].fullDate);

  return (
    <Dialog
      open={partyOpen}
      onOpenChange={(open) => {
        setPartyOpen(open);
        if (!open) setStep("FORM");
      }}
    >
      <DialogContent
        className={`bg-zinc-900 text-white border border-white/20 w-[90%] min-h-[75%] sm:w-105! px-13 py-10 ${dialogWidth}`}
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
              <Button
                className="bg-zinc-700 hover:bg-zinc-700/80 rounded-sm sm:w-[50%]"
                onClick={() => setStep("RESERVE")}
              >
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
        ) : step === "INVITE" ? (
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

            <div className="min-h-[200px] max-h-[300px] grid grid-cols-1 md:grid-cols-2 md:gap-x-20 items-start justify-center overflow-auto scrollbar-hidden">
              {isPending ? (
                // State 1: Pending
                <div className="col-span-full flex justify-center p-10 text-zinc-500">
                  초대 가능한 친구 목록을 불러오는 중...
                </div>
              ) : filteredFriends.length > 0 ? (
                // State 2: Data exists
                filteredFriends.map((friend: Friend) => {
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
                        <div className="shrink-0">
                          {profileImageUrl ? (
                            <img
                              src={profileImageUrl}
                              className="w-10 h-10 rounded-full object-cover border border-white/10"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-zinc-700/50 flex items-center justify-center rounded-full border border-white/5">
                              <ContactRound
                                size={20}
                                className="text-zinc-500"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm text-zinc-100 font-semibold truncate">
                            {friend.nickname}
                          </span>
                          <span className="text-xs text-zinc-500 truncate">
                            {friend.email}
                          </span>
                        </div>
                      </div>
                      <button
                        className={`shrink-0 flex items-center gap-1 px-2 py-1.5 rounded-sm text-[11px] font-bold transition-all duration-300 border backdrop-blur-md active:scale-95
              ${
                isSelected
                  ? "bg-[#816BFF] border-[#816BFF] text-white"
                  : "bg-[#816BFF]/40 border-[#816BFF] text-white hover:bg-[#816BFF]"
              }
              ${createPartyIsPending || joinPartyIsPending ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
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
                })
              ) : (
                // State 3: No results found
                <div className="col-span-full flex flex-col items-center justify-center py-10 text-zinc-500">
                  <Search size={24} className="mb-2 opacity-20" />
                  <p className="text-sm">검색 결과가 없습니다.</p>
                </div>
              )}
            </div>

            {selectedFriendObjects.length > 0 && (
              <div className="w-full bg-zinc-800/60 min-h-[20px] rounded-lg p-3 flex flex-wrap gap-2 items-center">
                <span className="text-sm mx-2">
                  {selectedFriendObjects.length}명
                </span>
                {selectedFriendObjects.map((friend: Friend) => (
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
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-y-1">
              <div>예약 날짜</div>
              <div className="text-zinc-400 text-sm">
                최대 일주일 후까지 예약이 가능해요
              </div>
              <DateCarousel
                availableDays={availableDays}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <div>예약 시간</div>
              <div className="text-zinc-400 text-sm">
                30분 단위로 예약이 가능해요
              </div>
              <div className="flex gap-3 items-center justify-start mt-1">
                {/* Hour Dropdown */}
                <div className="relative w-24">
                  <Select
                    value={selectedHour}
                    onValueChange={(value) => setSelectedHour(value)}
                  >
                    <SelectTrigger className="w-20! bg-zinc-800 border-white/5 text-white hover:border-white/20">
                      <SelectValue placeholder="시간 선택" />
                    </SelectTrigger>

                    <SelectContent
                      className="max-h-[200px]! w-20! overflow-y-auto scroll-hidden bg-zinc-900 border-white/10"
                      sideOffset={0}
                    >
                      {hours.map((h) => (
                        <SelectItem
                          key={h}
                          value={String(h)}
                          className="focus:bg-[#816BFF] focus:text-white text-white w-20! pr-none!"
                        >
                          {h}시
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Minute Dropdown */}
                <div className="relative w-24">
                  <select
                    value={selectedMinute}
                    onChange={(e) => setSelectedMinute(e.target.value)}
                    className={`${selectStyles}`}
                  >
                    {minutes.map((m) => (
                      <option key={m} value={m}>
                        {m}분
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
        {isWorking && (
          <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
            <AnimatedGradientText
              speed={1}
              colorFrom="#0000"
              colorTo="#A394FF"
              className="text-xl pt-10 pb-0 font-bold tracking-tight"
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
