export const Root = () => {
  return <Card />;
};

const Card = () => {
  return (
    <div className="fixed top-4 left-4 bg-white p-4 rounded-xl shadow-lg">
      <div className="mb-2 font-bold text-lg text-center">
        Pikachu - 0
      </div>

      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
        alt="pikachu"
        className="w-64 h-64 object-contain mx-auto"
      />
    </div>
  );
};
