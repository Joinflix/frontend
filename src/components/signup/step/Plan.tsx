import Block from "./Block";

interface PlanProps {
  plan: {
    id: number; // Added ID for API
    name: string;
    gradient: string;
    price: number; // Added price for payment
    features: { title: string; description: string }[];
  };
  onSelect: (id: number, price: number, name: string) => void;
}

const Plan = ({ plan, onSelect }: PlanProps) => {
  return (
    <div
      className="border border-gray-300 p-2 rounded-lg cursor-pointer hover:scale-107 transition-transform"
      onClick={() => onSelect(plan.id, plan.price, plan.name)}
    >
      {/* color block */}
      <div
        className={`bg-gradient-to-br ${plan.gradient} text-white rounded-sm p-2 px-3 pb-7`}
      >
        <span className="text-sm">{plan.name}</span>
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
