import { UUID } from './UUID'
import { Product } from './Product'
import { SchemaValue } from './Schema'

export interface CartItem {
  id: UUID
  deposits: unknown[] // TODO: type
  price: number
  product: Product
  quantity: number
  schemas: SchemaValue[]
}
