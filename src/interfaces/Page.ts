/* eslint-disable camelcase */
import { UUID } from './UUID'
import { SeoMetadata, SeoMetadataDto } from './SeoMetadata'

export interface Page {
  id: UUID
  name: string
  slug: string
  content_html: string
  public: boolean
  seo: SeoMetadata
}

export interface PageDto {
  id: UUID
  name: string
  slug: string
  content_md: string
  content_html: string
  public: boolean
  seo: SeoMetadataDto
}
export type PageDto = Omit<Page, 'id'>
