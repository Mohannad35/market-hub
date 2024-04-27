export const deleteQueryString = (entries: string[], params: URLSearchParams) => {
  entries.forEach(name => params.delete(name));
  return params;
};

export const createQueryString = (
  entries: { name: string; value: string }[],
  params: URLSearchParams
) => {
  entries.forEach(({ name, value }) => params.set(name, value));
  return params;
};
