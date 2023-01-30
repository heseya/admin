import { stringifyQueryParams as stringify } from '@heseya/store-core'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DefaultParams = Record<string, any>

export const stringifyQueryParams = (params: DefaultParams): string => {
  const query = stringify(params)
  return query ? `?${query}` : ''
}
