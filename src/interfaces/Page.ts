/* eslint-disable camelcase */
import { UUID } from './UUID'
import { SeoMetadata, SeoMetadataDto } from './SeoMetadata'
import { Metadata } from './Metadata'

export interface Page {
  id: UUID
  name: string
  slug: string
  content_html: string
  public: boolean
  seo: SeoMetadata
  metadata: Metadata
  metadata_private?: Metadata
}

export interface PageDto {
  name: string
  slug: string
  content_html: string
  public: boolean
  seo: SeoMetadataDto
}
