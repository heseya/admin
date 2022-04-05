/* eslint-disable camelcase */
import { UUID } from './UUID'
import { Schema } from './Schema'
import { Tag } from './Tag'
import { CdnMedia } from './Media'
import { ProductSet } from './ProductSet'
import { SeoMetadata, SeoMetadataDto } from './SeoMetadata'
import { Sale } from './SalesAndCoupons'
import { Metadata } from './Metadata'
import { ProductAttribute } from './Attribute'

export interface Product {
  id: UUID
  name: string
  slug: string
  price: number
  price_min: number
  price_max: number
  min_price_discounted: number
  max_price_discounted: number
  sales: Sale[]
  description_html: string
  description_short: string
  public: boolean
  visible: boolean
  quantity_step: number
  order: number | null
  brand: ProductSet
  category: ProductSet
  sets: ProductSet[]
  schemas: Schema[]
  gallery: CdnMedia[]
  cover: CdnMedia
  tags: Tag[]
  seo: SeoMetadata
  attributes: ProductAttribute[]
  metadata: Metadata
  metadata_private?: Metadata
}

export interface ProductDTO {
  id?: UUID
  name: string
  slug: string
  price: number
  description_html: string
  description_short: string
  public: boolean
  quantity_step: number
  order: number | null
  sets: UUID[]
  tags: UUID[]
  schemas: UUID[]
  media: UUID[]
  seo: SeoMetadataDto
  /**
   * Attribute.id -> AttributeOption.id[]
   */
  attributes: Record<UUID, UUID[]>
}

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
    | 'min_price_discounted'
    | 'max_price_discounted'
    | 'sales'
    | 'metadata_private'
    | 'metadata'
  > {
  id?: UUID
  sets: UUID[]
}

export interface ProductItem {
  id: UUID
  name: string
  sku: string
  quantity: number
  metadata: Metadata
  metadata_private?: Metadata
}

export type ProductItemDto = Omit<ProductItem, 'id' | 'metadata' | 'metadata_private'>
