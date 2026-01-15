import { useEffect, useState } from "react";

// Colori per tipo
const typeColors: Record<string, string> = {
  normal: "bg-gray-300",
  fire: "bg-red-500",
  water: "bg-blue-400",
  electric: "bg-yellow-400",
  grass: "bg-green-400",
  ice: "bg-cyan-200",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-700",
  flying: "bg-indigo-300",
  psychic: "bg-pink-400",
  bug: "bg-green-600",
  rock: "bg-gray-500",
  ghost: "bg-indigo-700",
  dragon: "bg-purple-700",
  dark: "bg-gray-800",
  steel: "bg-gray-400",
  fairy: "bg-pink-300",
};

type CardProps = {
  name: string;
  id: number;
  types: string[];
  img: string;
};

type PokemonDetailsType = {
  name: string;
  id: number;
  types: string[];
  stats: { name: string; value: number }[];
  height: number;
  weight: number;
  abilities: string[];
  img: string;
};

export const Root = () => {
  const [pokemons, setPokemons] = useState<CardProps[]>([]);
  const [selected, setSelected] = useState<PokemonDetailsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151"); // primi 151
        const data = await res.json();

        // Per ogni Pokémon fetchiamo i dettagli per prendere i tipi
        const detailedPokemons = await Promise.all(
          data.results.map(async (p: any, idx: number) => {
            const id = idx + 1;
            const detailRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const detailData = await detailRes.json();
            return {
              name: p.name,
              id,
              types: detailData.types.map((t: any) => t.type.name),
              img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
            };
          })
        );

        setPokemons(detailedPokemons);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPokemons();
  }, []);

  const openDetails = async (id: number) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await res.json();

      setSelected({
        name: data.name,
        id: data.id,
        types: data.types.map((t: any) => t.type.name),
        stats: data.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat })),
        height: data.height,
        weight: data.weight,
        abilities: data.abilities.map((a: any) => a.ability.name),
        img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-10">Caricamento Pokédex...</div>;

  return (
    <div className="p-4 flex flex-wrap gap-4 justify-start">
      {pokemons.map((p) => {
        const mainType = p.types[0] || "normal";
        const bgColor = typeColors[mainType] || "bg-gray-300";

        return (
          <div
            key={p.id}
            onClick={() => openDetails(p.id)}
            className={`w-36 h-36 relative cursor-pointer transform transition hover:scale-105 hover:shadow-lg rounded-lg ${bgColor} flex flex-col items-center justify-center`}
          >
            {/* Nome + ID */}
            <div className="absolute top-1 left-1 font-bold text-xs bg-white/80 px-1 py-0.5 rounded">
              {p.name} - #{p.id}
            </div>
            {/* Tipo in basso a destra */}
            <div className="absolute bottom-1 right-1 flex flex-col items-end gap-0.5">
              {p.types.map((type) => (
                <span
                  key={type}
                  className="bg-white/80 text-black text-[8px] px-1 py-0.5 rounded"
                >
                  {type}
                </span>
              ))}
            </div>
            <img src={p.img} alt={p.name} className="w-24 h-24 object-contain" />
          </div>
        );
      })}

      {/* Modal dettagli */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
            <div className="text-2xl font-bold capitalize text-center">
              {selected.name} - #{selected.id}
            </div>
            <img src={selected.img} alt={selected.name} className="w-48 h-48 mx-auto object-contain" />
            <div className="flex gap-2 justify-center mt-2">
              {selected.types.map((type) => (
                <span
                  key={type}
                  className={`${typeColors[type] || "bg-gray-300"} text-white px-2 py-1 rounded text-xs capitalize`}
                >
                  {type}
                </span>
              ))}
            </div>
            <div className="mt-4">
              <h3 className="font-bold">Statistiche:</h3>
              {selected.stats.map((stat) => (
                <div key={stat.name} className="flex justify-between text-sm">
                  <span className="capitalize">{stat.name}</span>
                  <span>{stat.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <div>Altezza: {selected.height / 10} m</div>
              <div>Peso: {selected.weight / 10} kg</div>
            </div>
            <div className="mt-2">
              <h3 className="font-bold">Abilità:</h3>
              <div className="flex gap-2 flex-wrap">
                {selected.abilities.map((a) => (
                  <span key={a} className="bg-yellow-200 px-2 py-1 rounded text-xs capitalize">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
