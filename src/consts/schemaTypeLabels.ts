import { SchemaType } from '../interfaces/Schema'

export const SchemaTypeLabel: Record<SchemaType, string> = {
  [SchemaType.String]: 'Wartość tekstowa',
  [SchemaType.Select]: 'Wybór spośród kilku opcji',
  [SchemaType.Numeric]: 'Wartość numeryczna',
  [SchemaType.Boolean]: 'Wartość typu prawda/fałsz',
  [SchemaType.Multiply]: 'Mnożona wartość numeryczna',
  [SchemaType.MultiplySchema]: 'Mnożenie schematów',
  // [SchemaType.Date]: 'Data',
  // [SchemaType.File]: 'Plik',
}
