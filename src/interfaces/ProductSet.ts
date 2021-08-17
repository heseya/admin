/* eslint-disable camelcase */
import { UUID } from './UUID'

export interface ProductSet {
  id: UUID
  name: string
  slug: Readonly<string>
  slug_suffix: string
  slug_override: boolean
  public: boolean
  visible: boolean
  hide_on_index: boolean
  parent: ProductSet | null
  children: ProductSet[]
}

export interface ProductSetDTO {
  id?: UUID
  name: string
  slug_suffix: string
  slug_override: boolean
  public: boolean
  hide_on_index: boolean
  parent_id: UUID | null
  children_ids: UUID[]
}
