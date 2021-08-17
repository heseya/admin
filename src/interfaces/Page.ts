/* eslint-disable camelcase */
import { UUID } from './UUID'

export interface Page {
  id: UUID
  name: string
  slug: string
  content_md: string
  content_html: string
  public: boolean
}
