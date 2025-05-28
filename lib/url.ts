import qs from "query-string";

interface FormUrlQueryProps {
  params: string;
  key: string;
  value: string;
}

interface RemoveKeysFromUrlParams {
  params: string;
  keysToRemove: string[];
}

export function formUrlQuery({ params, key, value }: FormUrlQueryProps) {
  const queryString = qs.parse(params);
  queryString[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryString,
    },
    { skipNull: true },
  );
}

export function removeKeysFromUrlParams({
  params,
  keysToRemove,
}: RemoveKeysFromUrlParams) {
  const queryString = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete queryString[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryString,
    },
    { skipNull: true },
  );
}

// stringyUrl converts parsed JS object (queryString) into string and creates new URL.
