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
