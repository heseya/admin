import { sdk } from '@/api'
import { UUID } from '@/interfaces/UUID'
import { CdnMediaUpdateDto } from '@heseya/store-core'
import { ApiError } from '@/utils/errors'

export const uploadMedia = async (file: File) => {
  try {
    const uploadedFile = await sdk.Media.create({ file })

    return {
      success: true as const,
      file: uploadedFile,
    }
  } catch (error: any) {
    return {
      success: false as const,
      error: error as ApiError,
    }
  }
}

export const updateMedia = async (media: CdnMediaUpdateDto & { id: UUID }) => {
  try {
    const updatedMedia = await sdk.Media.update(media.id, media)

    return {
      success: true as const,
      file: updatedMedia,
    }
  } catch (error: any) {
    return {
      success: false as const,
      error: error as ApiError,
    }
  }
}

export const removeMedia = async (mediaId: UUID): Promise<true | Error> => {
  try {
    await sdk.Media.delete(mediaId)
    return true
  } catch (error: any) {
    return error as ApiError
  }
}
