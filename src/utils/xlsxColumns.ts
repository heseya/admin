import { isString } from 'lodash'

/**
 * @param {string} columnsConfig
 * columnsConfig is an array of tuple of strings; first is label, second is a chain of keys
 * example value:
 * [["EAN", "metadata.ean"], ["Some Label", "someKey.anotherKeyInSomKey"]]
 */
export const extractAdditionalColumnsConfig = (columnsConfig: unknown): [string, string][] => {
  if (!columnsConfig || !isString(columnsConfig)) return []

  try {
    const parsedConfig = JSON.parse(columnsConfig)

    if (!Array.isArray(parsedConfig)) return []

    if (
      parsedConfig.every(
        (columnTuple) =>
          Array.isArray(columnTuple) && isString(columnTuple[0]) && isString(columnTuple[1]),
      )
    ) {
      return parsedConfig
    }

    return []
  } catch (_e) {
    return []
  }
}

const getObjValueByKeyChain = <T extends object>(obj: T, keyChain: string[]): unknown => {
  try {
    const [firstKey, ...restKeyChain] = [...keyChain]

    // @ts-expect-error: it's unknown
    const value = obj[firstKey]

    if (value === undefined || !restKeyChain.length) {
      return value
    }

    return getObjValueByKeyChain(value, restKeyChain)
  } catch (_error) {
    return undefined
  }
}

const generateColumn = (
  columnTuple: [string, string],
): { key: string; label: string; format: (v: unknown, obj: object) => unknown } => {
  const label = columnTuple[0]
  const keyChain = columnTuple[1]

  const keyArray = keyChain.split('.')

  return {
    key: keyChain,
    label: label,
    format: (_v: any, obj: object) => {
      return getObjValueByKeyChain(obj, keyArray)
    },
  }
}

export const generateColumns = (
  columnTuples: [string, string][] | any,
): { key: string; label: string; format: (v: unknown, obj: object) => unknown }[] => {
  if (Array.isArray(columnTuples)) {
    try {
      return columnTuples
        .filter((columnTuple) => isString(columnTuple[0]) && isString(columnTuple[1]))
        .map(generateColumn)
    } catch (_error) {
      return []
    }
  }

  return []
}
