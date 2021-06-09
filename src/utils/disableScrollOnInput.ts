export const disableScrollOnInput = () => {
  document.addEventListener('wheel', function(event) {
    // @ts-ignore
    if (document.activeElement?.type === 'number') {
      // @ts-ignore
      document.activeElement.blur()
    }
  })
}
