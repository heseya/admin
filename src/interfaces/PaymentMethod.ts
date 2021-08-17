import { UUID } from './UUID'

export interface PaymentMethod {
  alias: string
  id: UUID
  name: string
  public: boolean
}
