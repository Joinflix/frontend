const Block = ({ title, description }) => {
  return (
    <>
      <div className="text-gray-500 text-xs">{title}</div>
      <div className="font-semibold text-sm text-gray-600">{description}</div>
      <div className="mt-2 border-b border-gray-300"></div>
    </>
  );
};

export default Block;
