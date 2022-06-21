/* eslint-disable camelcase */
import { Attribute, CdnMedia, Metadata, SeoMetadata, SeoMetadataDto } from '@heseya/store-core'
import { UUID } from './UUID'

export interface ProductSet {
  id: UUID
  name: string
  slug: string
  slug_suffix: string
  description_html: string
  cover: CdnMedia | null
  slug_override: boolean
  public: boolean
  visible: boolean
  hide_on_index: boolean
  parent: ProductSet | null
  children: ProductSet[]
  seo: SeoMetadata
  attributes: Attribute[]
  metadata: Metadata
  metadata_private?: Metadata
  children_ids: UUID[]
}

export interface ProductSetDTO {
  id?: UUID
  name: string
  slug_suffix: string
  slug_override: boolean
  description_html: string
  cover: CdnMedia | null
  cover_id?: string
  public: boolean
  hide_on_index: boolean
  parent_id: UUID | null
  children_ids?: UUID[]
  seo: SeoMetadataDto | null
  attributes: UUID[]
}
