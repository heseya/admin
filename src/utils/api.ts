export const getApiURL = () => {
  switch (window.location.host) {
    // Production clients
    case 'admin.***REMOVED***.pl':
      return 'https://api.***REMOVED***.pl'
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
      return 'https://***REMOVED***.***REMOVED***'
    case '***REMOVED***-admin.stage.heseya.pl':
      return 'https://***REMOVED***-stage.***REMOVED***'
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
      return 'http://demo-hap.***REMOVED***'

    // Internal domains
    case '***REMOVED***':
      return 'https://release-4-0-0.***REMOVED***'
    case '***REMOVED***':
      return '***REMOVED***'
    default:
      return (process.env.VUE_APP_API_URL as string) || '***REMOVED***'
  }
}
