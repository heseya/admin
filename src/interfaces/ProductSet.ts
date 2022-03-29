/* eslint-disable camelcase */
import { UUID } from './UUID'
import { SeoMetadata, SeoMetadataDto } from './SeoMetadata'
import { CdnMedia } from './Media'
import { Attribute } from './Attribute'
import { Metadata } from './Metadata'

export interface ProductSet {
  id: UUID
  name: string
  slug: string
  slug_suffix: string
  description_html: string
  cover?: CdnMedia
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
}

export interface ProductSetDTO {
  id?: UUID
  name: string
  slug_suffix: string
  slug_override: boolean
  description_html: string
  cover?: CdnMedia
  cover_id?: string
  public: boolean
  hide_on_index: boolean
  parent_id: UUID | null
  children_ids: UUID[]
  seo: SeoMetadataDto
  attributes: UUID[]
}
