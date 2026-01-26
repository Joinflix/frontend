import { Check } from "lucide-react";

const CheckList = ({ item }) => {
  return (
    <div className="flex gap-2 items-center">
      <Check className="stroke-[#816BFF] size-4" /> {item}
    </div>
  );
};

export default CheckList;
