/* eslint-disable camelcase */
import { ID } from './ID'

export interface ProductSet {
  id: ID
  name: string
  slug: string
  slug_override: boolean
  public: boolean
  public_parent: boolean
  hide_on_index: boolean
  parent: ProductSet | null
  children: ProductSet[]
}
