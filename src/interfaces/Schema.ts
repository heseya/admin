import { UUID } from './UUID'
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
  id: UUID
  name: string
  default: boolean
  disabled: boolean
  price: number
  items: ProductItem[]
}
export interface Schema {
  id: UUID
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
  used_schemas: any[] // TODO: SchemaDTO
  validation: string
}

export interface SchemaValue {
  id: UUID
  name: string
  price: number
  value: string
}
