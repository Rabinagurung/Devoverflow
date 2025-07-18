import qs from "query-string";

interface FormUrlQueryProps {
  params: string;
  key: string;
  value: string | null;
}

interface RemoveKeysFromUrlParams {
  params: string;
  keysToRemove: string[];
}

export function formUrlQuery({ params, key, value }: FormUrlQueryProps) {
  const queryObject = qs.parse(params);

  if (value === null) {
    delete queryObject[key];
  } else {
    queryObject[key] = value;
  }

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryObject,
    },
    { skipNull: true },
  );
}

export function removeKeysFromUrlParams({
  params,
  keysToRemove,
}: RemoveKeysFromUrlParams) {
  const queryObject = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete queryObject[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryObject,
    },
    { skipNull: true },
  );
}

// stringyUrl converts parsed JS object (queryObject) into string and creates new URL.
