import { BannerCreateDto, BannerMedia } from '@heseya/store-core'
import { TranslationsFromDto } from './Translations'

export type BannerMediaComponentForm = Omit<
  Required<BannerMedia>,
  keyof TranslationsFromDto<BannerMedia>
>

export type BannerComponentForm = Omit<BannerCreateDto, 'banner_media'> & {
  id?: string
  banner_media: BannerMediaComponentForm[]
}
