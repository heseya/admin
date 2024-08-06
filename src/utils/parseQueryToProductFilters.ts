import { Dictionary } from 'vue-router/types/router'
import {
  EMPTY_PRODUCT_FILTERS,
  ProductFilters,
} from '@/components/modules/products/ProductsFilter.vue'

export const parseQueryToProductFilters = (
  query: Dictionary<string | (string | null)[]>,
): ProductFilters => {
  const filters: ProductFilters = {
    ...EMPTY_PRODUCT_FILTERS,
  }

  Object.entries(query).forEach(([key, value]) => {
    if (key === 'page') return
    filters[key] = value as any
  })

  const {
    sets,
    tags,
    public: isPublic,
    available,
    has_cover: hasCover,
    has_items: hasItems,
    has_schemas: hasSchemas,
    shipping_digital: shippingDigital,
  } = query
  filters.sets = (Array.isArray(sets) ? (sets as string[]) : [sets]).filter(Boolean)
  filters.tags = (Array.isArray(tags) ? (tags as string[]) : [tags]).filter(Boolean)
  filters.public = (isPublic as string) || EMPTY_PRODUCT_FILTERS.public
  filters.available = (available as string) || EMPTY_PRODUCT_FILTERS.available
  filters.has_cover = (hasCover as string) || EMPTY_PRODUCT_FILTERS.has_cover
  filters.has_items = (hasItems as string) || EMPTY_PRODUCT_FILTERS.has_items
  filters.has_schemas = (hasSchemas as string) || EMPTY_PRODUCT_FILTERS.has_schemas
  filters.shipping_digital = (shippingDigital as string) || EMPTY_PRODUCT_FILTERS.shipping_digital

  return filters
}
