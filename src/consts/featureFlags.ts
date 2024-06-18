/**
 * If heseya has following flags equal to '1' in advanced settings, the given experimental feature is enabled
 */
export const EXPERIMENTAL_FLAGS = {
  /**
   * QR codes scanner and generator for Orders
   */
  QrCodes: 'experimental_qr_codes',
}

/**
 * If heseya has following flags equal to '1' in advanced settings, the given feature is enabled
 */
export const FEATURE_FLAGS = {
  /**
   * B2B Companies with management of company discounts and prices
   */
  B2B: 'b2b_enabled',

  /**
   * If true, product images on every list will be shown as object-fit: contain, otherwise they will be shown as object-fit: cover
   */
  ProductContain: 'dashboard_products_contain',
}

export const SETTINGS_KEYS = {
  /**
   * When exists, it will be used to create a link on product page, that will redirect to the storefront url.
   * It should be a string with a place to concatenate the slug, e.g. 'https://example.com/product/'
   */
  StorefrontProductUrl: 'storefront_product_url',

  /**
   * This slug is used to highlight a product attribute on the product page and in order summary.
   * On product page, it will be shown in top right corner of the product page and it will copy the value to clipboard on click.
   * In order summary, it will be shown in the product list, next to the product name.
   */
  HighlightedProductAttribute: 'highlighted_product_attribute_slug',

  /**
   * If set, only currencies with codes from this list will be shown in the analytics chart on homepage
   */
  AnalyticsChartCurrencies: 'analytics_chart_currencies',
}
