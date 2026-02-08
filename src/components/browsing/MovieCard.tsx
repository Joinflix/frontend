const MovieCard = ({ item, onClick }) => {
  return (
    <div
      className="relative min-w-[100px] md:min-w-[150px] lg:min-w-[260px] cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-50"
      onClick={onClick}
    >
      <img
        src={item.poster}
        className="w-full h-full object-cover rounded-md"
      />

      {/* hover overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity rounded-md flex items-end p-2 text-white text-xs">
        {item.title}
      </div>
    </div>
  );
};

export default MovieCard;
