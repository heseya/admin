/* eslint-disable camelcase */
import { ID } from './ID'

export interface Page {
  id: ID
  name: string
  slug: string
  content_md: string
  content_html: string
  public: boolean
}
