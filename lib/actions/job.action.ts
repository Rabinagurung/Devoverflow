export const fetchLocation = async () => {
  const response = await fetch("http://ip-api.com/json/?fields=country");

  const location = await response.json();

  return location.country;
};

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const response = await fetch(
      "https://countriesnow.space/api/v0.1/countries/positions",
    );

    const result = await response.json();

    if (!Array.isArray(result?.data)) return [];

    return result.data.filter(
      (entry: unknown): entry is Country =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as Country).name === "string" &&
        (entry as Country).name.trim().length > 0 &&
        typeof (entry as Country).iso2 === "string" &&
        (entry as Country).iso2.trim().length > 0,
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchJobs = async (filters: JobFilterParams) => {
  const { query, page } = filters;

  const headers = {
    "X-RapidAPI-Key": process.env.RAPID_API_KEY ?? "",
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
  };

  try {
    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}`,
      { headers },
    );

    const result = await response.json();

    return result.data;
  } catch (error) {
    console.log(error);
  }
};
