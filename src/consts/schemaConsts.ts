import { cloneDeep } from 'lodash'
import { Schema, SchemaOption, SchemaType } from '../interfaces/Schema'

export const CLEAR_OPTION: SchemaOption = {
  id: '',
  name: '',
  default: false,
  disabled: false,
  price: 0,
  items: [],
}

export const CLEAR_FORM: Schema = {
  id: '',
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
