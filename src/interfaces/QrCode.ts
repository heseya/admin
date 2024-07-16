import { UUID } from './UUID'

export type QrCodeObject = 'Order'

export interface QrCodePayload<
  ObjectType extends QrCodeObject = QrCodeObject,
  Body extends Record<string, any> = Record<string, any>,
> {
  v: 1
  typ: ObjectType
  body: Body
}

export type OrderQrCode = QrCodePayload<
  'Order',
  {
    id: UUID
  }
>
