import { api } from '@/api'
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
