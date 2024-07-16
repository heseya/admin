import '@heseya/store-core'

// ? Here we can ovveride types in SDK, when they changed but SDK is not yet updated
declare module '@heseya/store-core' {
  interface SchemaOptionDto {
    default?: boolean
  }
}
