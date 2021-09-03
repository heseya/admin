export interface TableHeader {
  key: string
  label: string
  render?: (v: any) => any
}

export interface TableConfig {
  headers: TableHeader[]
  rowOnClick?: (item: any) => void
  rowUrlBuilder?: (item: any) => string
}

export interface TableRow {}
