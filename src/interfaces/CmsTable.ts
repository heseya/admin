import { BaseItem } from '@/store/generator'

export interface TableHeader {
  key: string
  label: string
  width?: string
  sortable?: boolean
  render?: (v: any) => string | number | boolean
}

export interface TableValue {
  key: string
  label: string
  value: any
  rawValue: any
}

export interface TableConfig<Item extends BaseItem = BaseItem> {
  headers: TableHeader[]
  rowOnClick?: (item: Item) => void
  rowUrlBuilder?: (item: Item) => string
}

export interface TableRow {}
