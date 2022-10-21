import '@heseya/store-core'
import { ShippingType } from './interfaces/ShippingType'

// ? Here we can ovveride types in SDK, when they changed but SDK is not yet updated
declare module '@heseya/store-core' {
  export interface AddressDto {
    id?: UUID
    name: string
    address: string
    vat?: string
    zip: string
    city: string
    country: string
    phone: string
  }

  export interface Order {
    id: UUID
    code: string
    comment?: string
    created_at: string
    currency: string
    shipping_place: AddressDto | string
    discounts: OrderDiscount[]
    email: string
    billing_address: AddressDto | null
    payable: boolean
    paid: boolean
    payments: Payment[]
    products: OrderProduct[]
    shipping_method: ShippingMethod
    shipping_method_id: UUID
    shipping_number?: string
    shipping_type: ShippingType
    status: OrderStatus

    /**
     * basket value without discounts
     */
    cart_total_initial: number
    /**
     * basket value after discounts
     */
    cart_total: number

    /**
     * shipping price without discounts
     */
    shipping_price_initial: number
    /**
     * shipping price after discounts
     */
    shipping_price: number

    /**
     * total order value after discounts
     */
    summary: number
    /**
     * amount already paid by client
     */
    summary_paid: number
    metadata: Metadata
    metadata_private?: Metadata
    documents: OrderDocument[]
    buyer: any
  }

  export interface OrderUpdateDto {
    comment?: string
    email?: string
    shipping_method_id?: UUID
    shipping_place?: AddressDto | string
    billing_address?: AddressDto | null
  }

  export interface ShippingMethod {
    id: UUID
    name: string
    shipping_type: ShippingType
    payment_methods: PaymentMethod[]
    public: boolean
    block_list: boolean
    shipping_time_min: number
    shipping_time_max: number
    countries: ShippingMethodCountry[]
    price_ranges: ShippingMethodPriceRange[]
    integration_key?: string
    app_id?: UUID
    shipping_points: AddressDto[]
  }

  export interface ShippingMethodCreateDto extends CreateMetadataFields {
    name: string
    public: boolean
    block_list: boolean
    /** List of the Country.code's */
    countries: string[]
    shipping_type: ShippingType
    payment_methods: UUID[]
    price_ranges: {
      start: number
      value: number
    }[]
    shipping_time_max: number
    shipping_time_min: number
    integration_key?: string
    app_id?: UUID
    shipping_points: AddressDto[]
  }
}
