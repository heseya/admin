import { api } from '@/api'
import { UUID } from '@/interfaces/UUID'
import { CdnMedia } from '@heseya/store-core'
import { ApiError } from '@/utils/errors'

export const uploadMedia = async (file: File) => {
  try {
    const form = new FormData()
    form.append('file', file)

    const { data } = await api.post<{ data: CdnMedia }>('/media', form)

    return {
      success: true as const,
      file: data.data,
    }
  } catch (error: any) {
    return {
      success: false as const,
      error: error as ApiError,
    }
  }
}

export const updateMedia = async (media: CdnMedia) => {
  try {
    const { data } = await api.patch<{ data: CdnMedia }>(`/media/id:${media.id}`, media)

    return {
      success: true as const,
      file: data.data,
    }
  } catch (error: any) {
    return {
      success: false as const,
      error: error as ApiError,
    }
  }
}

export const removeMedia = async (fileId: UUID): Promise<true | Error> => {
  try {
    await api.delete<null>(`/media/id:${fileId}`)
    return true
  } catch (error: any) {
    return error as ApiError
  }
}
