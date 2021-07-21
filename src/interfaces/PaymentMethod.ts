import { ID } from './ID'

export interface PaymentMethod {
  alias: string
  id: ID
  name: string
  public: boolean
}
