import Block from "./Block";

const Plan = ({
  plan,
}: {
  plan: {
    name: string;
    gradient: string;
    features: { title: string; description: string }[];
  };
}) => {
  return (
    <div className="border border-gray-300 p-2 rounded-lg">
      {/* color block */}
      <div
        className={`bg-gradient-to-br ${plan.gradient} text-white rounded-sm p-2 px-5`}
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
