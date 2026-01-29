import type { PartyType } from "../../types/party";
import PartyNameInput from "./PartyNameInput";
import PartyPasswordInput from "./PartyPasswordInput";

const PartyForm = ({ partyType }: { partyType: PartyType }) => {
  return (
    <div className="w-full flex flex-col gap-3 mt-3">
      <PartyNameInput />
      {partyType === "PRIVATE" && <PartyPasswordInput />}
    </div>
  );
};

export default PartyForm;
