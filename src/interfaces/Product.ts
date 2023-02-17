/* eslint-disable camelcase */
import { SeoMetadataDto, Product } from '@heseya/store-core'
import { UUID } from './UUID'

/**
 * Inner interface to handle product form data
 */
export interface ProductComponentForm
  extends Omit<
    Product,
    | 'id'
    | 'sets'
    | 'brand'
    | 'category'
    | 'cover'
    | 'visible'
    | 'price_min'
    | 'price_max'
    | 'price_max_initial'
    | 'price_min_initial'
    | 'has_schemas'
    | 'availability'
    | 'available'
    | 'quantity'
    | 'shipping_digital'
    | 'shipping_time'
    | 'shipping_date'
    | 'sales'
    | 'seo'
    | 'metadata_private'
    | 'metadata'
  > {
  id?: UUID
  sets: UUID[]
  shipping_digital: '0' | '1'
  seo?: SeoMetadataDto
}
