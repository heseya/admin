import { cloneDeep } from 'lodash'
import { SchemaType, SchemaOptionDto, WarehouseItem, SchemaCreateDto } from '@heseya/store-core'

export const CLEAR_OPTION: SchemaOptionDto & {
  items: WarehouseItem[]
  default: boolean
} = {
  name: '',
  default: false,
  disabled: false,
  available: false,
  price: 0,
  items: [],
}

export const CLEAR_FORM: SchemaCreateDto = {
  available: true,
  products: [],
  name: '',
  type: SchemaType.Select,
  description: '',
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
  options: [cloneDeep(CLEAR_OPTION)],
}
