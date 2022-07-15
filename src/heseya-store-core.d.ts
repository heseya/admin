import '@heseya/store-core'

// ? Here we can ovveride types in SDK, when they changed but SDK is not yet updated
declare module '@heseya/store-core' {
  export interface PaymentMethod {
    alias: string
    id: UUID
    name: string
    icon: string
    public: boolean
    url: string
  }
}
