/* eslint-disable camelcase */
import { ID } from './ID'

export interface ProductSet {
  id: ID
  name: string
  slug: Readonly<string>
  slug_suffix: string
  slug_override: boolean
  public: boolean
  public_parent: boolean
  hide_on_index: boolean
  parent: ProductSet | null
  children: ProductSet[]
}

export interface ProductSetDTO {
  id?: ID
  name: string
  slug_suffix: string
  slug_override: boolean
  public: boolean
  hide_on_index: boolean
  parent_id: ID | null
  children_ids: ID[]
}
