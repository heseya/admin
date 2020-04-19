import queryString from 'query-string'

import { api } from '../api'

/**
 * Creates state, actions and mutation for CRUD methods of given entity
 * @param {string} name - uppercased string to be used in mutation names
 * @param {string} endpoint - CRUD API endoint for given entity type
 * @param {Object} custom - custom state, actions, mutations and getters. Are merged with genereted ones
 */
export const createStore = (name, endpoint, custom) => {
  const upperCaseName = name.toUpperCase()

  const mutations = {
    SET_ERROR: `${upperCaseName}_SET_ERROR`,
    SET_META: `${upperCaseName}_SET_META`,
    SET_DATA: `${upperCaseName}_SET_DATA`,
    ADD_DATA: `${upperCaseName}_ADD_DATA`,
    EDIT_DATA: `${upperCaseName}_EDIT_DATA`,
    REMOVE_DATA: `${upperCaseName}_REMOVE_DATA`,
    SET_SELECTED: `${upperCaseName}_SET_SELECTED`
  }

  return {
    namespaced: true,
    state: {
      ...(custom?.state || {}),
      error: null,
      meta: {},
      data: [],
      selected: {}
    },
    getters: {
      ...(custom?.getters || {}),
      getError (state) {
        return state.error
      },
      getMeta (state) {
        return state.meta
      },
      getSelected (state) {
        return state.selected
      },
      getData (state) {
        return state.data
      },
      getFromListById (state, searchedId) {
        return state.data.find(({ id }) => id === searchedId)
      }
    },
    mutations: {
      ...(custom?.mutations || {}),
      [mutations.SET_ERROR] (state, newError) {
        state.error = newError
      },
      [mutations.SET_META] (state, newMeta) {
        state.meta = newMeta
      },
      [mutations.SET_DATA] (state, newData = []) {
        state.data = newData
      },
      [mutations.ADD_DATA] (state, newItem) {
        state.data = [...state.data, newItem]
      },
      [mutations.EDIT_DATA] (state, editedItem) {
        const index = state.data.findIndex(({ id }) => id === editedItem.id)
        state.data[index] = editedItem
      },
      [mutations.REMOVE_DATA] (state, removedID) {
        state.data = state.data.filter(({ id }) => id !== removedID)
      },
      [mutations.SET_SELECTED] (state, newSelected) {
        state.selected = newSelected
      }
    },
    actions: {
      ...(custom?.actions || {}),
      async fetch ({ commit }, query) {
        commit(mutations.SET_ERROR, null)
        try {
          const stringQuery = queryString.stringify(query)
          const { data } = await api.get(`/${endpoint}?${stringQuery}`)
          commit(mutations.SET_DATA, data.data)
        } catch (error) {
          commit(mutations.SET_ERROR, error)
        }
      },
      async get ({ commit }, id) {
        commit(mutations.SET_ERROR, null)
        try {
          const { data: responseData } = await api.get(`/${endpoint}/id:${id}}`)
          commit(mutations.SET_SELECTED, responseData.data)
        } catch (error) {
          commit(mutations.SET_ERROR, error)
        }
      },
      async add ({ commit }, item) {
        commit(mutations.SET_ERROR, null)
        try {
          const { data } = await api.post(`/${endpoint}`, item)
          commit(mutations.ADD_DATA, data.data)
        } catch (error) {
          commit(mutations.SET_ERROR, error)
        }
      },
      async edit ({ commit }, { id, item }) {
        commit(mutations.SET_ERROR, null)
        try {
          const { data } = await api.put(`/${endpoint}/id:${id}`, item)
          commit(mutations.EDIT_DATA, data.data)
        } catch (error) {
          commit(mutations.SET_ERROR, error)
        }
      },
      async update ({ commit }, { id, item }) {
        commit(mutations.SET_ERROR, null)
        try {
          const { data } = await api.patch(`/${endpoint}/id:${id}`, item)
          commit(mutations.EDIT_DATA, data.data)
        } catch (error) {
          commit(mutations.SET_ERROR, error)
        }
      },
      async remove ({ commit }, id) {
        commit(mutations.SET_ERROR, null)
        try {
          await api.delete(`/${endpoint}/id:${id}`)
          commit(mutations.REMOVE_DATA, id)
        } catch (error) {
          commit(mutations.SET_ERROR, error)
        }
      }
    }
  }
}

export default {
  createStore
}
