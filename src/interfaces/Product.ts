/* eslint-disable camelcase */
import { ID } from './ID'
import { Schema } from './Schema'
import { Tag } from './Tag'
import { CdnMedia } from './Media'

export interface Product {
  id: ID
  name: string
  slug: string
  price: number
  description_html: string
  digital: boolean
  public: boolean
  brand_id: ID
  category_id: ID
  quantity_step: number
  schemas: Schema[]
  gallery: CdnMedia[]
  media: CdnMedia[]
  tags: Tag[]
}

export interface ProductItem {
  id: ID
  name: string
  sku: string
  quantity: number
}
