import { cloneDeep } from 'lodash'
import { SchemaType } from '../interfaces/SchemaType'

export const CLEAR_OPTION = {
  name: '',
  default: false,
  disabled: false,
  price: 0,
  items: [],
}

export const CLEAR_FORM = {
  name: '',
  type: SchemaType.select,
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
  options: [cloneDeep(CLEAR_OPTION)],
}
