import { ID } from './ID'

export interface Setting {
  id: ID
  name: string
  value: string
  public: boolean
  permanent: boolean
}
