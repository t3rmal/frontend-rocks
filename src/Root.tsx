import { useEffect, useState } from "react";
import { PokeAPI } from "./api";

type CardProps = {
  name: string;
  count: number; // qui ci mettiamo l'ID reale del Pokédex
  img: string;
};

type PokemonFromAPI = {
  name: string;
  url: string;
};

export const Root = () => {
  const [pokemons, setPokemons] = useState<CardProps[]>([]);

  useEffect(() => {
    PokeAPI.listPokemons()
      .then((response: { results: PokemonFromAPI[] }) => {
        const cards = response.results.map((pokemon) => {
          // estrai l'ID dal URL del pokemon
          const id = pokemon.url.split("/").filter(Boolean).pop();
          return {
            name: pokemon.name,
            count: Number(id), // <-- ID reale del Pokédex
            img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          };
        });
        setPokemons(cards);
      })
      .catch((error) => console.error("Errore fetching Pokemons:", error));
  }, []);

  return (
    <div className="flex justify-start items-start min-h-screen p-4 gap-4 flex-wrap">
      {pokemons.map((card) => (
        <Card
          key={card.count}
          name={card.name}
          count={card.count}
          img={card.img}
        />
      ))}
    </div>
  );
};

const Card = ({ name, count, img }: CardProps) => {
  return (
    <div className="flex flex-col bg-white p-2">
      <div className="relative w-72 h-72 bg-gray-100 rounded-lg">
        {/* Nome + ID del Pokédex */}
        <div className="absolute top-2 left-2 font-bold text-sm bg-white/80 px-2 py-1 rounded">
          {name} - #{count}
        </div>

        {/* Immagine */}
        <img
          src={img}
          alt={name}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};
