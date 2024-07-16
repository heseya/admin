import { SchemaOptionDto, WarehouseItem, SchemaCreateDto } from '@heseya/store-core'
import { TranslationsFromDto } from '@/interfaces/Translations'

export const CLEAR_SCHEMA_OPTION: SchemaOptionDto & {
  items: WarehouseItem[]
  default: boolean
} = {
  default: false,
  available: false,
  prices: [],
  items: [],
  translations: {},
}

export const CLEAR_SCHEMA_OPTION_TRANSLATION: TranslationsFromDto<SchemaOptionDto> = {
  name: '',
}

export const CLEAR_SCHEMA: SchemaCreateDto = {
  prices: [],
  required: true,
  default: '',
  used_schemas: [],
  options: [],
  published: [],
  translations: {},
}

export const CLEAR_SCHEMA_TRANSLATION: TranslationsFromDto<SchemaCreateDto> = {
  name: '',
  description: '',
}
