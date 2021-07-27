import { ID } from './ID'

export enum SchemaType {
  String = 'string',
  Select = 'select',
  Numeric = 'numeric',
  Boolean = 'boolean',
  Multiply = 'multiply',
  MultiplySchema = 'multiply_schema',
  // Date= 'date',
  // File= 'file',
}

export interface SchemaOption {
  id: ID
  name: string
  default: boolean
  disabled: boolean
  price: number
  items: any[]
}
export interface Schema {
  id: ID
  name: string
  description: string
  type: SchemaType
  available: boolean
  default: string | number
  hidden: boolean
  max: null | number
  min: null | number
  options: SchemaOption[]
  pattern: null | string
  price: number
  products: any[]
  required: boolean
  step: null | number
  // eslint-disable-next-line camelcase
  used_schemas: any[]
  validation: string
}
