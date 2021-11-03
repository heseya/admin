import capitalize from 'lodash/capitalize'

const namesMap: Record<string, string> = {
  delivery_address_id: 'Adres dostawy',
  invoice_address_id: 'Adres rozliczeniowy',
  status_id: 'Status zamówienia',
  content_html: 'Treść',
  slug: 'Link',
  name: 'Nazwa',
  public: 'Widoczność',
  price: 'Cena',
  quantity_step: 'Format ilości',
  description_html: 'Opis',
}

export const changeAuditKeyToName = (key: string): string => {
  try {
    return namesMap[key] || transformKey(key)
  } catch {
    return key
  }
}

const transformKey = (key: string): string =>
  capitalize(key.split('_id').join('').split('_').join(' '))
