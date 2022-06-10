import { UUID } from './UUID'

export enum QrCodeObject {
  Order = 'Order',
}

export interface QrCodePayload<ObjectType extends QrCodeObject, Body extends Record<string, any>> {
  _type: 'heseya-qr-code'
  _version: number
  apiUrl: string
  objectType: ObjectType
  body: Body
}

export type OrderQrCode = QrCodePayload<
  QrCodeObject.Order,
  {
    id: UUID
    code: string
  }
>
