export const getApiURL = () => {
  if (window.apiUrl !== 'REPLACE_ME') return window.apiUrl

  switch (window.location.host) {
    // Production clients
    case '***REMOVED***':
      return '***REMOVED***'
    case '***REMOVED***':
    case '***REMOVED***':
      return '***REMOVED***'
    case 'admin.***REMOVED***.eu':
      return 'https://***REMOVED***.***REMOVED***'
    case '***REMOVED***-admin.heseya.pl':
      return 'https://sandbox-***REMOVED***.***REMOVED***'
    case '***REMOVED***.heseya.com':
      return 'https://store-api.***REMOVED***.pl'
    case '***REMOVED***':
      return '***REMOVED***'
    case 'admin.***REMOVED***.com':
      return 'https://api.***REMOVED***.com'
    case 'admin-***REMOVED***.***REMOVED***':
      return 'https://***REMOVED***.***REMOVED***'
    case 'admin-***REMOVED***.***REMOVED***':
      return 'https://***REMOVED***.***REMOVED***'
    case '***REMOVED***':
      return '***REMOVED***'

    // Stage clients
    case '***REMOVED***-admin.stage.heseya.pl':
      return 'https://***REMOVED***-stage.***REMOVED***'
    case '***REMOVED***-admin.stage.heseya.pl':
      return 'https://demo-***REMOVED***.***REMOVED***'
    case '***REMOVED***-admin.stage.heseya.pl':
      return '***REMOVED***'
    case '***REMOVED***-admin.stage.heseya.pl':
      return 'https://demo-***REMOVED***.***REMOVED***'

    // Demo clients
    case '***REMOVED***':
      return '***REMOVED***'
    case '***REMOVED***':
      return '***REMOVED***'
    case '***REMOVED***':
      return '***REMOVED***'
    case '***REMOVED***':
      return '***REMOVED***'
    case 'admin-***REMOVED***.***REMOVED***':
      return 'https://demo-***REMOVED***.***REMOVED***'
    case '***REMOVED***':
      return '***REMOVED***'

    // Internal domains
    case '***REMOVED***':
      return '***REMOVED***'
    case '***REMOVED***':
      return '***REMOVED***'
    default:
      return import.meta.env.VITE_API_URL || '***REMOVED***'
  }
}
