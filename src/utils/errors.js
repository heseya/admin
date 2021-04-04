export const formatApiError = (error) => ({
  title: error.response.data?.message || error.message,
  text: Object.values(error.response?.data?.errors || {})[0] || '',
})
