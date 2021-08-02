/* eslint-disable camelcase */
import { cloneDeep } from 'lodash'
import { ID } from '@/interfaces/ID'

export interface Tree<T> {
  id: ID
  children: T[]
}

export interface TreeWithParents<T> extends Tree<T> {
  parent_id?: ID
  parent: T | null
}

const replaceInArray = <T extends { id: ID }>(array: T[], item: T): T[] => {
  const arrayCopy = cloneDeep(array)
  const itemIndex = arrayCopy.findIndex(({ id }) => id === item.id)
  if (itemIndex >= 0) arrayCopy[itemIndex] = cloneDeep(item)
  return arrayCopy
}

export const findInTree = <T extends Tree<T>>(array: T[], id: ID): T | undefined => {
  for (const item of array) {
    if (item.id === id) {
      return item
    }
    const found = findInTree(item.children, id)
    if (found) {
      return found
    }
  }
  return undefined
}

export const removeFromTree = <T extends TreeWithParents<T>>(array: T[], id: ID): T[] => {
  const item = findInTree(array, id)
  if (!item) return array

  const parent = findInTree(array, item.parent?.id || item.parent_id!)
  if (parent) {
    parent.children = parent.children.filter((child) => child.id !== id)
  }

  return array
}

export const updateItemInTree = <T extends TreeWithParents<T>>(array: T[], updatedItem: T): T[] => {
  const item = findInTree(array, updatedItem.id)
  if (!item) return [...array, updatedItem]

  const parent = findInTree(array, item.parent?.id || item.parent_id!)
  if (parent) {
    parent.children = replaceInArray(parent.children, updatedItem)
    return array
  }

  // Root level
  return replaceInArray(array, updatedItem)
}