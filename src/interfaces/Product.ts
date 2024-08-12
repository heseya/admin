/* eslint-disable camelcase */
import {
  SeoMetadataDto,
  Product,
  TranslationsCreateDto,
  ProductCreateDto,
} from '@heseya/store-core'
import { UUID } from './UUID'
import { TranslationsFromDto } from './Translations'

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
      | 'price_initial'
      | 'price'
      | 'prices_min'
      | 'prices_max'
      | 'prices_max_initial'
      | 'prices_min_initial'
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
      | 'translations'
    >,
    TranslationsCreateDto<TranslationsFromDto<ProductCreateDto>> {
  id?: UUID
  sets: UUID[]
  shipping_digital: '0' | '1'
  seo?: SeoMetadataDto
}
