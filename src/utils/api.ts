export const getApiURL = () => {
  switch (window.location.host) {
    case '***REMOVED***':
      return '***REMOVED***'
    case 'admin.***REMOVED***.pl':
      return 'https://***REMOVED***.***REMOVED***'
    case 'admin.***REMOVED***.eu':
      return 'https://***REMOVED***.***REMOVED***'
    case 'admin.***REMOVED***.eu':
      return 'https://***REMOVED***.***REMOVED***'
    case '***REMOVED***':
      return '***REMOVED***'
    case '***REMOVED***.heseya.com':
      return 'https://store-api.***REMOVED***.pl'
    case '***REMOVED***':
      return 'https://release-2-2-0.***REMOVED***'
    case '***REMOVED***':
      return '***REMOVED***'
    case 'client-demo-admin.heseya.com':
      return 'https://client-demo.***REMOVED***'
    case 'client-2-demo-admin.heseya.com':
      return 'https://client-2-demo.***REMOVED***'
    case 'client-3-demo-admin.heseya.com':
      return 'https://client-3-demo.***REMOVED***'
    case 'client-demo-admin.heseya.pl':
      return 'https://***REMOVED***.***REMOVED***'
    case '***REMOVED***':
      return '***REMOVED***'
    case 'sandbox-admin.heseya.com':
      return 'https://feature-sandbox.***REMOVED***'
    case 'store-admin-git-feature-payments-***REMOVED***':
      return 'https://feature-payments.***REMOVED***'
    default:
      return (process.env.VUE_APP_API_URL as string) || '***REMOVED***'
  }
}
