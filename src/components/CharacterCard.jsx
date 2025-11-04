import React, { useEffect, useState } from "react";
import { fetchResource } from "../services/api";

// Tailwind background colors mapped to species
const speciesColorMap = {
  Human: "bg-yellow-100",
  Droid: "bg-blue-100",
  Wookiee: "bg-red-100",
  unknown: "bg-gray-100",
};

function pickColorForSpecies(names = []) {
  if (!names || names.length === 0) return speciesColorMap["unknown"];
  const name = names[0];
  return speciesColorMap[name] || "bg-green-100";
}

export default function CharacterCard({ person, index, onOpen }) {
  const [speciesNames, setSpeciesNames] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadSpecies() {
      try {
        if (!person.species || person.species.length === 0) {
          if (active) setSpeciesNames(["Human"]);
          return;
        }

        const speciesData = await Promise.all(
          person.species.map((url) => fetchResource(url))
        );

        if (active) {
          setSpeciesNames(speciesData.map((s) => s.name));
        }
      } catch {
        if (active) setSpeciesNames(["unknown"]);
      }
    }

    loadSpecies();
    return () => {
      active = false;
    };
  }, [person.species]);

  const bgClass = pickColorForSpecies(speciesNames);
  const imgUrl = `https://picsum.photos/seed/sw-${index}/400/300`;

  return (
    <div
      className={`rounded-lg shadow hover:shadow-md overflow-hidden cursor-pointer transition-shadow ${bgClass}`}
    >
      <div
        className="h-44 bg-cover bg-center"
        style={{ backgroundImage: `url(${imgUrl})` }}
      />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{person.name}</h3>
          <button
            className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100"
            onClick={onOpen}
          >
            View
          </button>
        </div>
        <div className="text-xs text-gray-600">
          Species: {speciesNames.join(", ")}
        </div>
      </div>
    </div>
  );
}
