export const getApiURL = () => {
  if (!window.runtimeConfig.apiUrl) {
    // eslint-disable-next-line no-console
    alert('API URL is not defined!')
    throw new Error('API URL is not defined')
  }

  return window.runtimeConfig.apiUrl
}
