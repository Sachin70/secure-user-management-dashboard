export const buildQueryParams = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};

export const fetchWithAuth = async <T>(
  url: string,
  method: string = "GET",
  token: string = "",
  body: unknown = null,
  queryParams: Record<string, unknown> = {}
): Promise<T> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token !== "") {
    headers.Authorization = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const queryString = buildQueryParams(queryParams);
  const fetchUrl = `${url}?${queryString}`;

  try {
    const response = await fetch(fetchUrl, options);
    return (await response.json()) as T;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
    throw error;
  }
};
