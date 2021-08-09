import { api } from '@/api'
import { ID } from '@/interfaces/ID'
import { CdnMedia } from '@/interfaces/Media'

export const uploadMedia = async (file: File) => {
  try {
    const form = new FormData()
    form.append('file', file)

    const { data } = await api.post<{ data: CdnMedia }>('/media', form)

    return {
      success: true,
      file: data.data,
    }
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
}

export const removeMedia = async (fileId: ID): Promise<true | Error> => {
  try {
    await api.delete<null>(`/media/id:${fileId}`)
    return true
  } catch (error) {
    return error
  }
}
