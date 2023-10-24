import { VuexBaseItem } from './VuexGenerator'

export interface TableHeader<Item extends VuexBaseItem = any> {
  key: string
  label: string
  labelTooltip?: string
  width?: string
  sortable?: boolean
  render?: (keyValue: any, item: Item) => string | number | boolean | string[]
  wordBreak?: 'break-all' | 'break-word' | 'none'
  sortKey?: string | (() => string)
}

export interface TableValue {
  key: string
  label: string
  value: any
  rawValue: any
  wordBreak: 'break-all' | 'break-word' | 'none'
}

export interface TableConfig<Item extends VuexBaseItem = VuexBaseItem> {
  headers: TableHeader<Item>[]
  rowOnClick?: (item: Item) => void
  rowUrlBuilder?: (item: Item) => string
}

export interface TableRow {}
