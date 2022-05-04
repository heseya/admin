import { UUID } from './UUID'

/* eslint-disable camelcase */
export interface Consent {
  id: UUID
  name: string
  description_html: string
  required: boolean
  created_at: string
  updated_at: string
}

export interface ConsentDTO {
  name: string
  description_html: string
  required: boolean
}

export interface UserConsent extends Consent {
  value: boolean
}
