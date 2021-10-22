/* eslint-disable camelcase */
import { CdnMedia } from './Media'

export enum TwitterCardType {
  Summary = 'summary',
  SummaryLargeImage = 'summary_large_image',
}

export interface SeoMetadata {
  title?: string
  description?: string
  keywords?: string[]
  og_image?: CdnMedia
  twitter_card?: TwitterCardType
}
