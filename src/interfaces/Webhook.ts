/* eslint-disable camelcase */
import { UUID } from './UUID'

export interface WebHookEventLogEntry {
  id: UUID
  triggered_at: string // ISO 8601
  url: string
  status_code: number
}

export enum WebHookEvent {
  OrderCreated = 'OrderCreated',
  OrderUpdated = 'OrderUpdated',
  OrderUpdatedStatus = 'OrderUpdatedStatus',
  ProductCreated = 'ProductCreated',
  ProductUpdated = 'ProductUpdated',
  ProductDeleted = 'ProductDeleted',
  ItemCreated = 'ItemCreated',
  ItemUpdated = 'ItemUpdated',
  ItemUpdatedQuantity = 'ItemUpdatedQuantity',
  ItemDeleted = 'ItemDeleted',
  PageCreated = 'PageCreated',
  PageUpdated = 'PageUpdated',
  PageDeleted = 'PageDeleted',
  ProductSetCreated = 'ProductSetCreated',
  ProductSetUpdated = 'ProductSetUpdated',
  ProductSetDeleted = 'ProductSetDeleted',
  UserCreated = 'UserCreated',
  UserUpdated = 'UserUpdated',
  UserDeleted = 'UserDeleted',
  DiscountCreated = 'DiscountCreated',
  DiscountUpdated = 'DiscountUpdated',
  DiscountDeleted = 'DiscountDeleted',
}

export interface WebHook {
  id: UUID
  url: string
  events: WebHookEvent[]
  name?: string
  secret?: string
  with_issuer: boolean // Czy ma zawierać informacje o użytkowniku/aplikacji
  with_hidden: boolean // Czy ma wysyłać informację o ukrytych zasobach
  logs: WebHookEventLogEntry[]
}

export type WebHookDto = Omit<WebHook, 'id' | 'logs'>
