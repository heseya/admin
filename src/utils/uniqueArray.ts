export const uniqueArray = <T>(a: T[]): T[] =>
  [...new Set(a.map((o) => JSON.stringify(o)))].map((s) => JSON.parse(s))
