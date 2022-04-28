/* eslint-disable camelcase */
import { UUID } from './UUID'
import { Metadata } from './Metadata'

export enum CdnMediaType {
  Photo = 'photo',
  Video = 'video',
}

export interface CdnMedia {
  id: UUID
  type: CdnMediaType
  url: string
  alt?: string
  slug?: string
  metadata: Metadata
  metadata_private?: Metadata
}
