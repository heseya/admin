import { getLastElement, getDaysDiff, formatDate } from '../utils'

describe('Utils: getLastElement', () => {
  it('should return the last element of an array', () => {
    expect(getLastElement([1, 2, 3])).toEqual(3)
  })

  it('should return the last element of a string', () => {
    expect(getLastElement('foo' as any)).toEqual('o')
  })

  it('should return the last element of an empty array', () => {
    expect(getLastElement([])).toEqual(undefined)
  })

  it('should return the last element of an undefined array', () => {
    expect(getLastElement(undefined as any)).toEqual(undefined)
  })

  it('should return the last element of an object', () => {
    expect(getLastElement({} as any)).toEqual(undefined)
  })

  it('should return the last element of a null object', () => {
    expect(getLastElement(null as any)).toEqual(undefined)
  })

  it('should return the last element of an empty object', () => {
    expect(getLastElement({} as any)).toEqual(undefined)
  })

  it('should return the last element of an empty array', () => {
    expect(getLastElement([])).toEqual(undefined)
  })

  it('should return the last element of an undefined array', () => {
    expect(getLastElement(undefined as any)).toEqual(undefined)
  })
})

describe('Utils: getDaysDiff', () => {
  it('should return the difference in days between two dates', () => {
    expect(getDaysDiff(new Date(2017, 11, 1), new Date(2017, 11, 2))).toEqual(1)
    expect(getDaysDiff(new Date(2017, 11, 1), new Date(2017, 11, 1))).toEqual(0)
    expect(getDaysDiff(new Date(2017, 11, 1), new Date(2017, 11, 3))).toEqual(2)
    expect(getDaysDiff(new Date(2017, 11, 3), new Date(2017, 11, 1))).toEqual(-2)
  })
})
