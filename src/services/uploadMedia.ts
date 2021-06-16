import { api } from '@/api'

export const uploadMedia = async (file: File) => {
  try {
    const form = new FormData()
    form.append('file', file)

    const { data } = await api.post('/media', form)

    return {
      success: true,
      url: data.data,
    }
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
}
