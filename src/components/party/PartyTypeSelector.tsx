import { Earth, LockKeyhole } from "lucide-react";
import type { PartyType } from "../../types/party";
import PartyTypeCard from "./PartyTypeCard";
import PartyTypeCardNeon from "./PartyTypeCardNeon";

interface Props {
  value: PartyType;
  onChange: (type: PartyType) => void;
}

const PartyTypeSelector = ({ value, onChange }: Props) => {
  return (
    <>
      <div className="flex gap-5">
        <PartyTypeCard
          title="공개 파티"
          description="다른 사람이 초대 없이 파티에 들어올 수 있어요"
          icon={<Earth />}
          active={value === "PUBLIC"}
          onClick={() => onChange("PUBLIC")}
        />

        <PartyTypeCard
          title="비공개 파티"
          description="파티 비밀번호를 입력해야 참여할 수 있어요"
          icon={<LockKeyhole />}
          active={value === "PRIVATE"}
          onClick={() => onChange("PRIVATE")}
        />
      </div>

      <div className="flex gap-5">
        <PartyTypeCardNeon
          title="공개 파티"
          description="다른 사람이 초대 없이 파티에 들어올 수 있어요"
          icon={<Earth />}
          active={value === "PUBLIC"}
          onClick={() => onChange("PUBLIC")}
        />

        <PartyTypeCardNeon
          title="비공개 파티"
          description="파티 비밀번호를 입력해야 참여할 수 있어요"
          icon={<LockKeyhole />}
          active={value === "PRIVATE"}
          onClick={() => onChange("PRIVATE")}
        />
      </div>
    </>
  );
};

export default PartyTypeSelector;
