import { WarehouseItem, SchemaCreateDto, SchemaOptionCreateDto } from '@heseya/store-core'
import { TranslationsFromDto } from '@/interfaces/Translations'

export const CLEAR_SCHEMA_OPTION: SchemaOptionCreateDto & {
  items: WarehouseItem[]
} = {
  default: false,
  items: [],
  translations: {},
}

export const CLEAR_SCHEMA_OPTION_TRANSLATION: TranslationsFromDto<SchemaOptionCreateDto> = {
  name: '',
}

export const CLEAR_SCHEMA: SchemaCreateDto = {
  required: true,
  used_schemas: [],
  options: [],
  published: [],
  translations: {},
  product_id: '',
  hidden: false,
}

export const CLEAR_SCHEMA_TRANSLATION: TranslationsFromDto<SchemaCreateDto> = {
  name: '',
  description: '',
}
