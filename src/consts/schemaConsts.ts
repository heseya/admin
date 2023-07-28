import { cloneDeep } from 'lodash'
import { SchemaType, SchemaOptionDto, WarehouseItem, SchemaCreateDto } from '@heseya/store-core'
import { TranslationsFromDto } from '@/interfaces/Translations'

export const CLEAR_SCHEMA_OPTION: SchemaOptionDto & {
  items: WarehouseItem[]
  default: boolean
} = {
  // TODO: remove name
  name: '',
  default: false,
  disabled: false,
  available: false,
  price: 0,
  items: [],
  translations: {},
}

export const CLEAR_SCHEMA_OPTION_TRANSLATION: TranslationsFromDto<SchemaOptionDto> = {
  name: '',
}

export const CLEAR_SCHEMA: SchemaCreateDto = {
  // TODO: remove name and description
  name: '',
  description: '',
  available: true,
  products: [],
  type: SchemaType.Select,
  price: 0,
  hidden: false,
  required: true,
  min: 0,
  max: 0,
  step: 0.1,
  default: '',
  pattern: '',
  validation: '',
  used_schemas: [],
  options: [cloneDeep(CLEAR_SCHEMA_OPTION)],
  published: [],
  translations: {},
}

export const CLEAR_SCHEMA_TRANSLATION: TranslationsFromDto<SchemaCreateDto> = {
  name: '',
  description: '',
}
