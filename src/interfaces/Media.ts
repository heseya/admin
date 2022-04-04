/* eslint-disable camelcase */
import { Metadata } from './Metadata'

export enum CdnMediaType {
  Photo = 'photo',
  Video = 'video',
}

export interface CdnMedia {
  id: string
  type: CdnMediaType
  url: string
  alt?: string
  slug?: string
  metadata: Metadata
  metadata_private?: Metadata
}
