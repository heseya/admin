import slugify from 'slugify'

slugify.extend({
  '/': '-',
  '(': '-',
  ')': '-',
  ',': '-',
})
