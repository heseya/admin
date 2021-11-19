/* eslint-disable camelcase */
import { UUID } from './UUID'
import { SeoMetadata, SeoMetadataDto } from './SeoMetadata'

export interface ProductSet {
  id: UUID
  name: string
  slug: string
  slug_suffix: string
  slug_override: boolean
  public: boolean
  visible: boolean
  hide_on_index: boolean
  parent: ProductSet | null
  children: ProductSet[]
  seo: SeoMetadata
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
  seo: SeoMetadataDto
}
