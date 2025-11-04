import React, { useEffect, useState } from "react";

const CharacterModal = ({
  person,
  onClose,
  fetchResource,
  cmToMeters,
  massToKg,
  formatDateISOtoDDMMYYYY,
}) => {
  const [species, setSpecies] = useState([]);
  const [homeworld, setHomeworld] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const hw = await fetchResource(person.homeworld);
        const sArr = await Promise.all(
          (person.species || []).map((url) => fetchResource(url))
        );

        if (!mounted) return;
        setHomeworld(hw);
        setSpecies(sArr);
      } catch (e) {
        console.error("Error fetching character details:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => (mounted = false);
  }, [person]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 mx-3 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{person.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-lg font-semibold"
          >
            ✕
          </button>
        </div>

        {/* Main content */}
        {loading ? (
          <div className="py-10 text-center text-gray-600">
            Loading character details…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div>
              <Info label="Height" value={cmToMeters(person.height)} />
              <Info label="Mass" value={massToKg(person.mass)} />
              <Info
                label="Date Added"
                value={formatDateISOtoDDMMYYYY(person.created)}
              />
              <Info label="Films" value={person.films?.length ?? 0} />
              <Info label="Birth Year" value={person.birth_year} />
            </div>

            {/* Right column */}
            <div>
              <div className="mb-4">
                <div className="text-sm text-gray-600">Homeworld</div>
                {homeworld ? (
                  <div className="mt-2">
                    <div className="font-semibold text-gray-800">
                      {homeworld.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Terrain: {homeworld.terrain}
                    </div>
                    <div className="text-sm text-gray-600">
                      Climate: {homeworld.climate}
                    </div>
                    <div className="text-sm text-gray-600">
                      Population: {homeworld.population}
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-gray-500">Loading homeworld…</div>
                )}
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-2">Species</div>
                {species.length > 0 ? (
                  species.map((s) => (
                    <div
                      key={s.name}
                      className="text-sm text-gray-700 mb-1 border-b pb-1"
                    >
                      {s.name} — {s.classification}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">
                    Loading species or none declared
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-right border-t pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function Info({ label, value }) {
  return (
    <div className="mb-3">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="font-medium text-gray-800">{value}</div>
    </div>
  );
}

export default CharacterModal;
