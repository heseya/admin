import { SeoMetadata, TranslationsRecord } from '@heseya/store-core'

export const initializeSeoInTranslations = <T extends TranslationsRecord<{ seo?: SeoMetadata }>>(
  translations: T,
) =>
  Object.fromEntries(
    Object.entries(translations).map(([key, form]) => [
      key,
      { ...form, seo: form.seo || {} } as T[keyof T] & { seo: SeoMetadata },
    ]),
  )
