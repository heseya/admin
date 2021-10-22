/* eslint-disable camelcase */
import { UUID } from './UUID'
import { Schema } from './Schema'
import { Tag } from './Tag'
import { CdnMedia } from './Media'
import { ProductSet } from './ProductSet'
import { SeoMetadata } from './SeoMetadata'

export interface Product {
  id: UUID
  name: string
  slug: string
  price: number
  description_html: string
  digital: boolean
  public: boolean
  visible: boolean
  quantity_step: number
  brand: ProductSet
  category: ProductSet
  sets: ProductSet[]
  schemas: Schema[]
  gallery: CdnMedia[]
  cover: CdnMedia
  tags: Tag[]
  seo: SeoMetadata
}

export interface ProductDTO {
  id?: UUID
  name: string
  slug: string
  price: number
  description_html: string
  digital: boolean
  public: boolean
  quantity_step: number
  sets: UUID[]
  tags: UUID[]
  schemas: UUID[]
  media: UUID[]
  seo: SeoMetadata
}

export interface ProductComponentForm
  extends Omit<Product, 'id' | 'sets' | 'brand' | 'category' | 'cover' | 'visible'> {
  id?: UUID
  sets: UUID[]
}

export interface ProductItem {
  id: UUID
  name: string
  sku: string
  quantity: number
}
