import { VuexBaseItem } from './VuexGenerator'

export interface XlsxFileHeader<Item extends VuexBaseItem = any> {
  key: keyof Item
  label: string
  format?: (key: any, item?: Item) => string | number
}

export interface XlsxFileConfig<Item extends VuexBaseItem = VuexBaseItem> {
  name: string
  headers: XlsxFileHeader<Item>[]
}
