import { ID } from './ID'
import { Product } from './Product'
import { SchemaValue } from './Schema'

export interface CartItem {
  id: ID
  deposits: unknown[] // TODO: type
  price: number
  product: Product
  quantity: number
  schemas: SchemaValue[]
}
