import { WarehouseItem, SchemaCreateDto, SchemaOptionCreateDto } from '@heseya/store-core'
import { TranslationsFromDto } from '@/interfaces/Translations'
import { SchemaOptionViewModel } from '@/components/modules/schemas/SchemaOptionsEditor.vue'
import type { SchemaFormViewModel } from '@/components/modules/schemas/Form.vue'

export const CLEAR_SCHEMA_OPTION: SchemaOptionCreateDto & {
  items: WarehouseItem[]
} = {
  default: false,
  items: [],
  translations: {},
}

export const CLEAR_SCHEMA_OPTION_VIEW_MODEL: SchemaOptionViewModel = {
  default: false,
  items: [],
  translations: {},
}

export const CLEAR_SCHEMA_OPTION_TRANSLATION: TranslationsFromDto<SchemaOptionCreateDto> = {
  name: '',
}

export const CLEAR_SCHEMA_FORM_VIEW_MODEL: SchemaFormViewModel = {
  required: true,
  used_schemas: [],
  hidden: false,
  published: [],
  translations: {},
}

export const CLEAR_SCHEMA_TRANSLATION: TranslationsFromDto<SchemaCreateDto> = {
  name: '',
  description: '',
}
