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

    return Array.isArray(result?.data) ? result.data : [];
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
