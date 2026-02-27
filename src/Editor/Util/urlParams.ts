export const getFirstSearchParam = (
  search: string,
  key: string,
): string => {
  const params = new URLSearchParams(search);
  return params.getAll(key)[0] ?? "";
};
