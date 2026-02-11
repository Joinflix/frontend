import Block from "./Block";

interface PlanProps {
  plan: {
    membershipId: number;
    planName: string;
    amount: number;
    gradient: string;
    features: { title: string; description: string }[];
  };
  onSelect: (id: number, price: number, name: string) => void;
}

const Plan = ({ plan, onSelect }: PlanProps) => {
  return (
    <div
      className="border border-gray-300 p-2 rounded-lg cursor-pointer hover:scale-107 transition-transform"
      onClick={() => onSelect(plan.membershipId, plan.amount, plan.planName)}
    >
      {/* color block */}
      <div
        className={`bg-gradient-to-br ${plan.gradient} text-white rounded-sm p-2 px-3 pb-7`}
      >
        <span className="text-sm">{plan.planName}</span>
        <span className="text-sm"> {plan.amount} </span>
      </div>

      {/* features */}
      <div className="flex flex-col pt-4 p-2 gap-y-1">
        {plan.features.map(({ title, description }) => (
          <Block key={title} title={title} description={description} />
        ))}
      </div>
    </div>
  );
};

export default Plan;
