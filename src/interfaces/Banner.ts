/* eslint-disable camelcase */
import { CdnMedia } from './Media'
import { UUID } from './UUID'

export interface Banner {
  id: UUID
  slug: string
  url: string
  name: string
  active: boolean
  responsive_media: ResponsiveMedia[]
}

export type ResponsiveMedia = { min_screen_width: number; media: CdnMedia }[]

export interface BannerDto {
  slug: string
  url: string
  name: string
  active: boolean
  responsive_media: ResponsiveMediaDto[]
}

export type ResponsiveMediaDto = { min_screen_width: number; media: UUID }[]
