const BASE_PLANETS_API = 'https://swapi.dev/api/planets';

const getPlanets = async () => {
  const response = await fetch(BASE_PLANETS_API);
  const json = await response.json();
  return response.ok ? Promise.resolve(json) : Promise.reject(json);
};

export default getPlanets;
