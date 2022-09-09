import { BaseItem } from './VuexGenerator'

export interface XlsxFileHeader<Item extends BaseItem = any> {
  key: keyof Item
  label: string
  format?: (key: any, item?: Item) => string | number
}

export interface XlsxFileConfig<Item extends BaseItem = BaseItem> {
  name: string
  headers: XlsxFileHeader<Item>[]
}
