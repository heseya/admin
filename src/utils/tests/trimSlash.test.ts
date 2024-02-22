import { trimSlash } from '../trimSlash'

describe('Utils: trimSlash', () => {
  it('should remove trailing slash from end of the link', () => {
    expect(trimSlash('https://example.com/')).toEqual('https://example.com')
  })
  it('should not remove anything if url doenst ends with slash', () => {
    expect(trimSlash('https://example.com')).toEqual('https://example.com')
  })
})
