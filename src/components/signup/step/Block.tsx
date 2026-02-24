const Block = ({ title, description }) => {
  return (
    <div className="pb-2">
      <div className="text-gray-500 text-xs pl-1">{title}</div>
      <div className="font-semibold text-sm text-gray-600 pl-1">
        {description}
      </div>
      <div className="mt-2 border-b border-gray-300"></div>
    </div>
  );
};

export default Block;
