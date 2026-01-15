export const Root = () => {
  return (
    <div className="flex justify-start items-start min-h-screen p-4">
      <Card />
    </div>
  );
};

const Card = () => {
  return (
    <div className="flex flex-col bg-white border-2 border-black p-2">
      
      {/* quadrato testo */}
      <div className="flex justify-center items-center border-2 border-black mb-2 h-12 font-bold">
        Pikachu - 0
      </div>

      {/* quadrato immagine */}
      <div className="flex justify-center items-center border-2 border-black w-72 h-72">
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
          alt="pikachu"
          className="w-full h-full object-contain"
        />
      </div>

    </div>
  );
};

