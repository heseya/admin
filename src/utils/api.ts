export const getApiURL = () => {
  switch (window.location.host) {
    case '***REMOVED***':
      return '***REMOVED***'
    case 'admin.***REMOVED***.pl':
      return 'https://***REMOVED***.***REMOVED***'
    case 'admin.***REMOVED***.eu':
      return 'https://***REMOVED***.***REMOVED***'
      return 'https://***REMOVED***.***REMOVED***'
    case 'admin.***REMOVED***.eu':
      return 'https://***REMOVED***.***REMOVED***'
    case '***REMOVED***':
      return '***REMOVED***'
    case '***REMOVED***':
      return 'https://rc.***REMOVED***'
    case 'store-admin-git-feature-hes-273-***REMOVED***':
      return 'https://sandbox.***REMOVED***'
    default:
      return process.env.VUE_APP_API_URL || 'https://dev.***REMOVED***'
  }
}
