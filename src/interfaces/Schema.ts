import { ID } from './ID'
import { Product, ProductItem } from './Product'

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
  items: ProductItem[]
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
  products: Product[]
  required: boolean
  step: null | number
  // eslint-disable-next-line camelcase
  used_schemas: Schema[]
  validation: string
}

export interface SchemaValue {
  id: ID
  name: string
  price: number
  value: number | string
}
