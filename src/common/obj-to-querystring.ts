/**
 * Convert object to query string, remove properties with undefined, null, or empty string value
 */
export function objToQueryString(obj: Record<string, unknown>): string {
  const filterNonExist = (obj: Record<string, unknown>) => {
    const result: Record<string, string> = {};
    for (const key in obj) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
        result[key] = `${obj[key]}`;
      }
    }
    return result;
  };

  const filteredObj = filterNonExist(obj);

  return new URLSearchParams(filteredObj).toString();
}
