/* eslint-disable camelcase */
import { ID } from './ID'
import { Schema } from './Schema'
import { Tag } from './Tag'
import { CdnMedia } from './Media'
import { ProductSet } from './ProductSet'

export interface Product {
  id: ID
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
}

export interface ProductDTO {
  id?: ID
  name: string
  slug: string
  price: number
  description_html: string
  digital: boolean
  public: boolean
  quantity_step: number
  sets: ID[]
  tags: ID[]
  schemas: ID[]
  media: ID[]
}

export interface ProductComponentForm
  extends Omit<Product, 'id' | 'sets' | 'brand' | 'category' | 'cover' | 'visible'> {
  id?: ID
  sets: ID[]
}

export interface ProductItem {
  id: ID
  name: string
  sku: string
  quantity: number
}
