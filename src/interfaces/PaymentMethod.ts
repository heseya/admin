import { UUID } from './UUID'

export interface PaymentMethod {
  alias: string
  id: UUID
  name: string
  icon: string
  public: boolean
  url: string
}
