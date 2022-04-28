/* eslint-disable camelcase */
import { CdnMedia } from './Media'
import { Metadata } from './Metadata'
import { UUID } from './UUID'

export interface Banner {
  id: UUID
  slug: string
  name: string
  active: boolean
  banner_media: BannerMedia[]
  metadata: Metadata
  metadata_private?: Metadata
}

export interface BannerMedia {
  id: UUID
  order: number
  url: string | null
  title: string | null
  subtitle: string | null
  media: { min_screen_width: number; media: CdnMedia }[]
}

export interface BannerDto {
  slug: string
  name: string
  active: boolean
  banner_media: BannerMediaDto[]
}

export interface BannerMediaDto {
  url: string | null
  title: string | null
  subtitle: string | null
  media: { min_screen_width: number; media: UUID }[]
}
