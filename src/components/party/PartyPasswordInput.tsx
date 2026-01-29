const PartyPasswordInput = () => (
  <div className="flex flex-col gap-2">
    <label className="text-sm">비밀번호 설정</label>
    <input
      className="text-sm border border-white/50 p-3 rounded-xs bg-transparent"
      placeholder="숫자 4자리를 입력해 주세요"
    />
  </div>
);

export default PartyPasswordInput;
