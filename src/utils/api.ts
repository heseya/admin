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
    case '***REMOVED***':
      return 'https://rc.***REMOVED***'
    case '***REMOVED***':
      return '***REMOVED***'
    case 'client-demo-admin.heseya.com':
      return 'https://client-demo.***REMOVED***'
    case 'client-2-demo-admin.heseya.com':
      return 'https://client-2-demo.***REMOVED***'
    case '***REMOVED***':
      return '***REMOVED***'
    case 'store-admin-git-feature-languages-***REMOVED***':
      return 'https://sandbox.***REMOVED***'
    case 'store-admin-git-feature-attributes-***REMOVED***':
    case 'store-admin-git-feature-filters-***REMOVED***':
      return 'https://feature-attributes.***REMOVED***'
    case 'store-admin-git-feature-metadata-***REMOVED***':
      return 'https://feature-metadata.***REMOVED***'
    default:
      return process.env.VUE_APP_API_URL || '***REMOVED***'
  }
}
