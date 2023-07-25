import { Translations } from '@heseya/store-core'

// TODO: this is currently unused
export type FlattenTranslationsDto<Dto> = Dto extends Translations<infer Content>
  ? Dto & Content
  : unknown
