export enum CdnMediaType {
  Photo = 1,
  Video = 2,
}

export interface CdnMedia {
  id: string
  type: CdnMediaType
  url: string
}
