import { UUID } from './UUID'

export interface PackageTemplate {
  id: UUID
  name: string
  width: number
  height: number
  depth: number
  weight: number
}
