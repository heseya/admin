export const getDefaultUiLanguage = () => {
  const browserLang = window.navigator.language
  if (browserLang.includes('pl')) return 'pl'
  return 'en'
}
