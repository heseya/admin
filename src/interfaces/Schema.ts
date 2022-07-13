/* eslint-disable camelcase */
import { Product, Metadata, WarehouseItem, SchemaType } from '@heseya/store-core'
import { UUID } from './UUID'

// TODO: Delete when suitable store-core version available

export interface SchemaOption {
  id: UUID
  name: string
  default: boolean
  disabled: boolean
  price: number
  items: WarehouseItem[]
  metadata: Metadata
  metadata_private?: Metadata
}

export type SchemaOptionDto = Omit<SchemaOption, 'id' | 'metadata' | 'metadata_private'>
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
  used_schemas: any[] // TODO: SchemaDTO
  validation: string
  auto_dependecy?: boolean // TODO: not implemented on backend
  metadata: Metadata
  metadata_private?: Metadata
}

// TODO: full Schema DTO
export interface SchemaDto
  extends Omit<Schema, 'id' | 'metadata' | 'metadata_private' | 'options'> {
  options: SchemaOptionDto[]
}

export interface SchemaValue {
  id: UUID
  name: string
  price: number
  value: string
}
