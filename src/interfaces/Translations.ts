import { Translations } from '@heseya/store-core'

// TODO: this is currently unused
export type FlattenTranslationsDto<Dto> = Dto extends Translations<infer Content>
  ? Dto & Content
  : unknown

export type TranslationsFromDto<Dto> = Dto extends Translations<infer Content> ? Content : unknown
