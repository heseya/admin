import capitalize from 'lodash/capitalize'

export const changeAuditKeyToName = (key: string): string => {
  switch (key) {
    case 'delivery_address_id':
      return 'Adres dostawy'
    case 'invoice_address_id':
      return 'Adres rozliczeniowy'
    case 'status_id':
      return 'Status zamówienia'
    case 'content_html':
      return 'Treść'
    case 'slug':
      return 'Link'
    case 'name':
      return 'Nazwa'
    case 'public':
      return 'Widoczność'
    default:
      return transformKey(key)
  }
}

const transformKey = (key: string): string =>
  capitalize(key.split('_id').join('').split('_').join(' '))
