import { Metadata } from './Metadata'
import { UUID } from './UUID'

export interface PackageTemplate {
  id: UUID
  name: string
  width: number
  height: number
  depth: number
  weight: number
  metadata: Metadata
  // eslint-disable-next-line camelcase
  metadata_private?: Metadata
}
