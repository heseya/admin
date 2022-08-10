import { BaseItem } from '@/store/generator'

export interface FileHeader<Item extends BaseItem = any> {
  key: keyof Item
  label: string
  format?: (key: any) => string | number
}

export interface FileConfig<Item extends BaseItem = BaseItem> {
  name: string
  headers: FileHeader<Item>[]
}
