import '@heseya/store-core'

// ? Here we can ovveride types in SDK, when they changed but SDK is not yet updated
declare module '@heseya/store-core' {
  export interface EntityAudits<Entity> {
    id: UUID
    event: 'created' | 'updated'
    created_at: string
    old_values: Partial<Entity>
    new_values: Partial<Entity>
    issuer_type: string
    issuer: UserList | App
  }
}
