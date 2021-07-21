import { api } from '@/api'

interface CdnFile {
  id: string
  type: 'photo'
  url: string
}

export const uploadMedia = async (file: File) => {
  try {
    const form = new FormData()
    form.append('file', file)

    const { data } = await api.post<{ data: CdnFile }>('/media', form)

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
