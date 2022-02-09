import { UUID } from './UUID'

export interface Language {
  id: UUID
  iso: string // de, fr-CA, de-DE-1996
  name: string
  default: boolean
  hidden: boolean
}

export interface LanguageDto extends Omit<Language, 'id'> {
  id?: UUID
}
