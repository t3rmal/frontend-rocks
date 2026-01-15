import { useEffect, useState } from "react";

type CardProps = {
  id: number;
  name: string;
  types: string[];
  img: string;
};

type PokemonDetailsType = {
  id: number;
  name: string;
  types: string[];
  height: number;
  weight: number;
  abilities: string[];
  stats: { name: string; value: number }[];
  img: string;
};

export const Root = () => {
  const [pokemons, setPokemons] = useState<CardProps[]>([]);
  const [selected, setSelected] = useState<PokemonDetailsType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1. Fetch base di tutti i Pokémon
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=1025");
        const data = await res.json();

        const cards: CardProps[] = data.results.map((p: any, idx: number) => {
          const id = idx + 1;
          return {
            id,
            name: p.name,
            types: [], // verrà aggiornato subito dopo
            img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          };
        });

        setPokemons(cards);

        // 2. Fetch leggero solo per tipi
        const updatedCards = await Promise.all(
          cards.map(async (p) => {
            try {
              const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.id}`);
              const data = await res.json();
              return { ...p, types: data.types.map((t: any) => t.type.name) };
            } catch {
              return p;
            }
          })
        );

        setPokemons(updatedCards);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAll();
  }, []);

  // funzione click per aprire dettaglio completo
  const handleClick = async (p: CardProps) => {
    setLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.id}`);
      const data = await res.json();

      const details: PokemonDetailsType = {
        id: data.id,
        name: data.name,
        types: data.types.map((t: any) => t.type.name),
        height: data.height,
        weight: data.weight,
        abilities: data.abilities.map((a: any) => a.ability.name),
        stats: data.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat })),
        img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
      };

      setSelected(details);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 flex flex-wrap gap-2 justify-start relative">
      {pokemons.map((p) => (
        <div
          key={p.id}
          className="w-24 h-24 relative cursor-pointer flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:scale-105 transform transition"
          onClick={() => handleClick(p)}
        >
          {/* Nome + ID */}
          <div className="absolute top-1 left-1 font-bold text-[8px] bg-white/80 px-1 py-0.5 rounded">
            {p.name} - #{p.id}
          </div>

          {/* Tipo in basso a destra */}
          <div className="absolute bottom-1 right-1 flex flex-col items-end gap-0.5">
            {p.types.length > 0 ? p.types.map((type) => (
              <span key={type} className="bg-gray-200 text-black text-[6px] px-1 py-0.5 rounded capitalize">
                {type}
              </span>
            )) : (
              <span className="bg-gray-200 text-black text-[6px] px-1 py-0.5 rounded">?</span>
            )}
          </div>

          <img src={p.img} alt={p.name} className="w-16 h-16 object-contain" />
        </div>
      ))}

      {/* MODAL DETTAGLIO */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-red-500 font-bold"
              onClick={() => setSelected(null)}
            >
              X
            </button>
            {loading ? (
              <div className="text-center">Caricamento...</div>
            ) : (
              <>
                <div className="text-2xl font-bold capitalize mb-2">{selected.name} - #{selected.id}</div>
                <img src={selected.img} alt={selected.name} className="w-32 h-32 object-contain mx-auto mb-2" />
                <div className="flex gap-2 justify-center mb-2">
                  {selected.types.map((type) => (
                    <span key={type} className="bg-gray-200 text-black px-2 py-1 rounded text-xs capitalize">{type}</span>
                  ))}
                </div>
                <div className="text-sm mb-2">
                  Altezza: {selected.height / 10} m <br />
                  Peso: {selected.weight / 10} kg
                </div>
                <div className="text-sm mb-2">
                  <h4 className="font-bold">Abilità:</h4>
                  {selected.abilities.join(", ")}
                </div>
                <div className="text-sm">
                  <h4 className="font-bold">Stats:</h4>
                  {selected.stats.map((s) => (
                    <div key={s.name} className="flex justify-between">
                      <span className="capitalize">{s.name}</span>
                      <span>{s.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
