const PartyNameInput = () => (
  <div className="flex flex-col gap-2">
    <label className="text-sm">파티 이름</label>
    <input
      className="text-sm border border-white/50 p-3 rounded-xs bg-transparent"
      placeholder="다른 사람들에게 보여질 파티 이름이에요"
    />
  </div>
);

export default PartyNameInput;
