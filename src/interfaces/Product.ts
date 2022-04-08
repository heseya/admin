/* eslint-disable camelcase */
import { UUID } from './UUID'
import { Schema } from './Schema'
import { Tag } from './Tag'
import { CdnMedia } from './Media'
import { ProductSet } from './ProductSet'
import { SeoMetadata, SeoMetadataDto } from './SeoMetadata'
import { Metadata } from './Metadata'
import { ProductAttribute } from './Attribute'

export interface ProductInnerItem {
  id: UUID
  name: string
  required_quantity: number
}

export interface Product {
  id: UUID
  name: string
  slug: string
  price: number
  price_min: number
  price_max: number
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
  items: ProductInnerItem[]
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
  items: Omit<ProductInnerItem, 'name'>[]
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
    | 'metadata'
    | 'metadata_private'
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
