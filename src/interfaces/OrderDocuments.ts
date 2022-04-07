import { UUID } from './UUID'

export enum OrderDocumentType {
  Other = 'other',
  Receipt = 'receipt',
  Invoice = 'invoice',
}

export interface OrderDocument {
  id: UUID
  type: OrderDocumentType
  name: string | null
}

export interface OrderDocumentDto {
  type: OrderDocumentType
  name?: string
  file: File
}
