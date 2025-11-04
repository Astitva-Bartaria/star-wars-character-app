import React, { useEffect, useState } from "react";
import CharacterCard from "../components/CharacterCard";
import CharacterModal from "../components/CharacterModal";
import { fetchResource } from "../services/api";
import {
  cmToMeters,
  massToKg,
  formatDateISOtoDDMMYYYY,
} from "../services/utils";

export default function CharacterList() {
  const [allCharacters, setAllCharacters] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  const [searchTerm, setSearchTerm] = useState("");
  const [homeworlds, setHomeworlds] = useState([]);
  const [films, setFilms] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);

  const [selectedHomeworld, setSelectedHomeworld] = useState("");
  const [selectedFilm, setSelectedFilm] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("");

  // Fetch all people from SWAPI (multiple pages)
  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        let url = "https://swapi.dev/api/people/";
        const all = [];
        while (url) {
          const res = await fetch(url);
          const data = await res.json();
          all.push(...data.results);
          url = data.next;
        }
        setAllCharacters(all);
      } catch (err) {
        console.error("Failed to load characters:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  // Fetch filter data (homeworlds, films, species)
  useEffect(() => {
    async function loadFilters() {
      try {
        const [planetRes, filmRes, speciesRes] = await Promise.all([
          fetch("https://swapi.dev/api/planets/"),
          fetch("https://swapi.dev/api/films/"),
          fetch("https://swapi.dev/api/species/"),
        ]);
        const [planetData, filmData, speciesData] = await Promise.all([
          planetRes.json(),
          filmRes.json(),
          speciesRes.json(),
        ]);
        setHomeworlds(planetData.results);
        setFilms(filmData.results);
        setSpeciesList(speciesData.results);
      } catch (err) {
        console.error("Failed to load filters:", err);
      }
    }
    loadFilters();
  }, []);

  // Apply search + filters
  const filtered = allCharacters.filter((char) => {
    const matchesName = char.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesHomeworld =
      !selectedHomeworld || char.homeworld === selectedHomeworld;

    const matchesFilm =
      !selectedFilm || (char.films && char.films.includes(selectedFilm));

    const matchesSpecies =
      !selectedSpecies ||
      (char.species && char.species.includes(selectedSpecies));

    return matchesName && matchesHomeworld && matchesFilm && matchesSpecies;
  });

  // Paginate filtered data
  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const visible = filtered.slice(start, end);

  useEffect(() => {
    setCharacters(visible);
  }, [filtered, page, perPage]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full sm:w-48"
          />

          {/* Homeworld filter */}
          <select
            value={selectedHomeworld}
            onChange={(e) => {
              setSelectedHomeworld(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full sm:w-40"
          >
            <option value="">All Homeworlds</option>
            {homeworlds.map((h) => (
              <option key={h.name} value={h.url}>
                {h.name}
              </option>
            ))}
          </select>

          {/* Film filter */}
          <select
            value={selectedFilm}
            onChange={(e) => {
              setSelectedFilm(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full sm:w-40"
          >
            <option value="">All Films</option>
            {films.map((f) => (
              <option key={f.title} value={f.url}>
                {f.title}
              </option>
            ))}
          </select>

          {/* Species filter */}
          <select
            value={selectedSpecies}
            onChange={(e) => {
              setSelectedSpecies(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-full sm:w-40"
          >
            <option value="">All Species</option>
            {speciesList.map((s) => (
              <option key={s.name} value={s.url}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
        </div>
      ) : (
        <>
          {/* Character grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {characters.map((person, index) => (
              <CharacterCard
                key={person.name}
                person={person}
                index={index}
                onOpen={() => setSelectedPerson(person)}
              />
            ))}
          </div>

          {/* Pagination controls */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
            <div className="text-gray-700">
              Page <span className="font-semibold">{page}</span> of{" "}
              <span className="font-semibold">{totalPages || 1}</span>
            </div>

            <div>
              <label htmlFor="perPage" className="mr-2 text-gray-700 text-sm">
                Cards per page:
              </label>
              <select
                id="perPage"
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {[3, 6, 9, 12].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className={`px-3 py-1 rounded ${
                  page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded ${
                  page === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Character modal */}
      {selectedPerson && (
        <CharacterModal
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
          fetchResource={fetchResource}
          cmToMeters={cmToMeters}
          massToKg={massToKg}
          formatDateISOtoDDMMYYYY={formatDateISOtoDDMMYYYY}
        />
      )}
    </div>
  );
}
