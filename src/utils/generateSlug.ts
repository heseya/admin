import slugify from 'slugify'

export const generateSlug = (str: string) => slugify(str, { lower: true, remove: /[.]/g })
