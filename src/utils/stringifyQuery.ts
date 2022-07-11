import queryString from 'query-string'
import flatten from 'flat'
import { isBoolean, isDate } from 'lodash'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DefaultParams = Record<string, any>

const transformParam = (value: unknown): unknown => {
  if (isBoolean(value)) return +value
  if (isDate(value)) return value.toISOString()
  return value
}

const transformAllParamValues = (params: DefaultParams): DefaultParams => {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, transformParam(value)]),
  )
}

// TODO: replace with implementation from @heseya/store-core
export const stringifyQueryParams = (params: DefaultParams): string => {
  const flattenedParams = flatten<DefaultParams, DefaultParams>(params, { safe: true })
  const transformedParams = transformAllParamValues(flattenedParams)

  const query = queryString.stringify(transformedParams, {
    arrayFormat: 'bracket',
    skipNull: true,
  })
  return query ? `?${query}` : ''
}
