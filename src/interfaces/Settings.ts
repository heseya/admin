import { UUID } from './UUID'

export interface Setting {
  id: UUID
  name: string
  value: string
  public: boolean
  permanent: boolean
}
