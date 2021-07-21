import { cloneDeep } from 'lodash'
import { SchemaType } from '../interfaces/Schema'

export const CLEAR_OPTION = {
  name: '',
  default: false,
  disabled: false,
  price: 0,
  items: [],
}

export const CLEAR_FORM = {
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
