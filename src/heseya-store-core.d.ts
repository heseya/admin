import '@heseya/store-core'

// ? Here we can ovveride types in SDK, when they changed but SDK is not yet updated
declare module '@heseya/store-core' {
  interface WarehouseDeposit {
    id: UUID
    sku: string
    quantity: number
    shipping_time: null | number
    shipping_date: null | string
    item_id: UUID
    order: { id: UUID; code: string } | null
    created_at: string
  }
}
