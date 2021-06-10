/* eslint-disable camelcase */

export interface ResponseMeta {
  currency: { name: string; symbol: string; decimals: number }
  current_page: number
  from: number
  language: { symbol: string }
  last_page: number
  path: string
  per_page: number
  to: number
  total: number
}