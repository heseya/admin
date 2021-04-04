export const SchemaType = {
  string: 'string',
  select: 'select',
  numeric: 'numeric',
  boolean: 'boolean',
  // date: 'date',
  // file: 'file',
}

export const SchemaTypeLabel = {
  [SchemaType.string]: 'Wartość tekstowa',
  [SchemaType.select]: 'Wybór spośród kilku opcji',
  [SchemaType.numeric]: 'Wartość numeryczna',
  [SchemaType.boolean]: 'Wartość typu prawda/fałsz',
  // [SchemaType.date]: 'Data',
  // [SchemaType.file]: 'Plik',
}
