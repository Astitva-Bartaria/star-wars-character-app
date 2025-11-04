const cache = new Map();

export async function fetchJson(url) {
  if (cache.has(url)) return cache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Network error");
  const json = await res.json();
  cache.set(url, json);
  return json;
}

export async function fetchPeoplePage(page = 1) {
  const url = `https://swapi.dev/api/people/?page=${page}`;
  return fetchJson(url);
}

export async function fetchResource(url) {
  return fetchJson(url);
}
