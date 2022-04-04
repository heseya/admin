/* eslint-disable camelcase */
import { Metadata } from './Metadata'
import { UUID } from './UUID'

/**
 * @deprecated
 * ! Deprecated in favor of Coupons & Sales
 */
export enum DiscountCodeType {
  Percentage = 0,
  Amount = 1,
}

/**
 * @deprecated
 * ! Deprecated in favor of Coupons & Sales
 */
export interface DiscountCode {
  id: UUID
  code: string
  description?: string
  type: DiscountCodeType
  discount: number
  uses: number
  max_uses: number
  available: boolean
  starts_at: string | null
  expires_at: string | null
  metadata: Metadata
  metadata_private?: Metadata
}

export type DiscountCodeDto = Omit<DiscountCode, 'id' | 'metadata' | 'metadata_private'>
