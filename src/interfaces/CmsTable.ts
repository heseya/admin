export interface TableHeader {
  key: string
  label: string
  width?: string
  sortable?: boolean
  render?: (v: any) => any
}

export interface TableValue {
  key: string
  label: string
  value: any
  rawValue: any
}

export interface TableConfig<T = any> {
  headers: TableHeader[]
  rowOnClick?: (item: T) => void
  rowUrlBuilder?: (item: T) => string
}

export interface TableRow {}
