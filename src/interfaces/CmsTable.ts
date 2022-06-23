import { BaseItem } from '@/store/generator'

export interface TableHeader<Item extends BaseItem = any> {
  key: string
  label: string
  width?: string
  sortable?: boolean
  render?: (keyValue: any, item: Item) => string | number | boolean
}

export interface TableValue {
  key: string
  label: string
  value: any
  rawValue: any
}

export interface TableConfig<Item extends BaseItem = BaseItem> {
  headers: TableHeader<Item>[]
  rowOnClick?: (item: Item) => void
  rowUrlBuilder?: (item: Item) => string
}

export interface TableRow {}
