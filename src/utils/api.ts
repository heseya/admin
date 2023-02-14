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
    case 'admin.***REMOVED***.pl':
      return 'https://***REMOVED***.***REMOVED***'
    case 'admin.***REMOVED***.eu':
      return 'https://***REMOVED***.***REMOVED***'
    case 'admin.***REMOVED***.eu':
      return 'https://***REMOVED***.***REMOVED***'

    // Demo clients
    case '***REMOVED***':
      return '***REMOVED***'
    case 'client-demo-admin.heseya.pl':
      return 'https://***REMOVED***.***REMOVED***'
    case 'client-demo-admin.heseya.com':
      return 'https://client-demo.***REMOVED***'
    case 'client-2-demo-admin.heseya.com':
      return 'https://client-2-demo.***REMOVED***'
    case 'client-3-demo-admin.heseya.com':
      return 'https://client-3-demo.***REMOVED***'
    case '***REMOVED***.heseya.com':
      return 'https://store-api.***REMOVED***.pl'
    case '***REMOVED***':
      return '***REMOVED***'
    case '***REMOVED***-admin.heseya.pl':
      return 'https://sandbox-***REMOVED***.***REMOVED***'
    case 'flowy.demo.heseya.pl':
      return 'https://demo-flowy.***REMOVED***/'
    case '***REMOVED***.demo.heseya.pl':
      return 'https://demo-***REMOVED***.***REMOVED***'

    // Internal domains
    case '***REMOVED***':
      return 'https://release-4-0-0.***REMOVED***'
    case '***REMOVED***':
      return '***REMOVED***'
    default:
      return (process.env.VUE_APP_API_URL as string) || '***REMOVED***'
  }
}
