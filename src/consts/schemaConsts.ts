import { SchemaType, SchemaOptionDto, WarehouseItem, SchemaCreateDto } from '@heseya/store-core'
import { TranslationsFromDto } from '@/interfaces/Translations'

export const CLEAR_SCHEMA_OPTION: SchemaOptionDto & {
  items: WarehouseItem[]
  default: boolean
} = {
  default: false,
  disabled: false,
  available: false,
  prices: [],
  items: [],
  translations: {},
}

export const CLEAR_SCHEMA_OPTION_TRANSLATION: TranslationsFromDto<SchemaOptionDto> = {
  name: '',
}

export const CLEAR_SCHEMA: SchemaCreateDto = {
  type: SchemaType.Select,
  prices: [],
  hidden: false,
  required: true,
  min: 0,
  max: 0,
  step: 0.1,
  default: '',
  pattern: '',
  validation: '',
  used_schemas: [],
  options: [],
  published: [],
  translations: {},
}

export const CLEAR_SCHEMA_TRANSLATION: TranslationsFromDto<SchemaCreateDto> = {
  name: '',
  description: '',
}
