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
    SET_SELECTED: `${upperCaseName}_SET_SELECTED`,
    SET_LOADING: `${upperCaseName}_SET_LOADING`,
  }

  return {
    namespaced: true,
    state: {
      ...(custom?.state || {}),
      error: null,
      isLoading: false,
      meta: {},
      data: [],
      selected: {},
    },
    getters: {
      ...(custom?.getters || {}),
      getError(state) {
        return state.error
      },
      getIsLoading(state) {
        return state.isLoading
      },
      getMeta(state) {
        return state.meta
      },
      getSelected(state) {
        return state.selected
      },
      getData(state) {
        return state.data
      },
      getFromListById(state) {
        return (searchedId) => ({ ...state.data.find(({ id }) => id === searchedId) })
      },
    },
    mutations: {
      ...(custom?.mutations || {}),
      [mutations.SET_ERROR](state, newError) {
        state.error = newError
      },
      [mutations.SET_LOADING](state, isLoading) {
        state.isLoading = isLoading
      },
      [mutations.SET_META](state, newMeta) {
        state.meta = newMeta
      },
      [mutations.SET_DATA](state, newData = []) {
        state.data = newData
      },
      [mutations.ADD_DATA](state, newItem) {
        state.data = [...state.data, newItem]
      },
      [mutations.EDIT_DATA](state, { key, value, item: editedItem }) {
        const index = state.data.findIndex((item) => item[key] === value)
        if (index >= 0) {
          const copy = [...state.data]
          copy[index] = editedItem
          state.data = copy
        } else {
          state.data = [...state.data, editedItem]
        }
      },
      [mutations.REMOVE_DATA](state, { key, value }) {
        state.data = state.data.filter((item) => item[key] !== value)
      },
      [mutations.SET_SELECTED](state, newSelected) {
        state.selected = newSelected
      },
    },
    actions: {
      ...(custom?.actions || {}),
      async fetch({ commit }, query) {
        commit(mutations.SET_ERROR, null)
        commit(mutations.SET_LOADING, true)
        try {
          const filteredQuery = query
            ? Object.fromEntries(Object.entries(query).filter(([key, value]) => !!value))
            : {}
          const stringQuery = queryString.stringify(filteredQuery)

          const { data } = await api.get(`/${endpoint}?${stringQuery}`)
          commit(mutations.SET_META, data.meta)
          commit(mutations.SET_DATA, data.data)
          commit(mutations.SET_LOADING, false)
          return true
        } catch (error) {
          commit(mutations.SET_ERROR, error)
          commit(mutations.SET_LOADING, false)
          return false
        }
      },
      async get({ commit }, id) {
        commit(mutations.SET_ERROR, null)
        commit(mutations.SET_LOADING, true)
        try {
          const { data: responseData } = await api.get(`/${endpoint}/id:${id}`)
          commit(mutations.SET_SELECTED, responseData.data)
          commit(mutations.SET_LOADING, false)
          return true
        } catch (error) {
          commit(mutations.SET_ERROR, error)
          commit(mutations.SET_LOADING, false)
          return false
        }
      },
      async add({ commit }, item) {
        commit(mutations.SET_ERROR, null)
        commit(mutations.SET_LOADING, true)
        try {
          const { data } = await api.post(`/${endpoint}`, item)
          commit(mutations.ADD_DATA, data.data)
          commit(mutations.SET_LOADING, false)
          return data.data
        } catch (error) {
          commit(mutations.SET_ERROR, error)
          commit(mutations.SET_LOADING, false)
          return false
        }
      },
      async edit({ commit }, { id, item }) {
        commit(mutations.SET_LOADING, true)
        commit(mutations.SET_ERROR, null)
        try {
          const { data } = await api.put(`/${endpoint}/id:${id}`, item)
          commit(mutations.EDIT_DATA, { key: 'id', value: id, item: data.data })
          commit(mutations.SET_LOADING, false)
          return data.data
        } catch (error) {
          commit(mutations.SET_ERROR, error)
          commit(mutations.SET_LOADING, false)
          return false
        }
      },
      async update({ commit }, { id, item }) {
        commit(mutations.SET_LOADING, true)
        commit(mutations.SET_ERROR, null)
        try {
          const { data } = await api.patch(`/${endpoint}/id:${id}`, item)
          commit(mutations.EDIT_DATA, { key: 'id', value: id, item: data.data })
          commit(mutations.SET_LOADING, false)
          return data.data
        } catch (error) {
          commit(mutations.SET_ERROR, error)
          commit(mutations.SET_LOADING, false)
          return false
        }
      },
      async updateByKey({ commit }, { key, value, item }) {
        commit(mutations.SET_LOADING, true)
        commit(mutations.SET_ERROR, null)
        try {
          const { data } = await api.patch(`/${endpoint}/${value}`, item)
          commit(mutations.EDIT_DATA, { key, value, item: data.data })
          commit(mutations.SET_LOADING, false)
          return data.data
        } catch (error) {
          commit(mutations.SET_ERROR, error)
          commit(mutations.SET_LOADING, false)
          return false
        }
      },
      async remove({ commit }, id) {
        commit(mutations.SET_LOADING, true)
        commit(mutations.SET_ERROR, null)
        try {
          await api.delete(`/${endpoint}/id:${id}`)
          commit(mutations.REMOVE_DATA, { key: 'id', value: id })
          commit(mutations.SET_LOADING, false)
          return true
        } catch (error) {
          commit(mutations.SET_ERROR, error)
          commit(mutations.SET_LOADING, false)
          return false
        }
      },
      async removeByKey({ commit }, { key, value }) {
        commit(mutations.SET_LOADING, true)
        commit(mutations.SET_ERROR, null)
        try {
          await api.delete(`/${endpoint}/${value}`)
          commit(mutations.REMOVE_DATA, { key, value })
          commit(mutations.SET_LOADING, false)
          return true
        } catch (error) {
          commit(mutations.SET_ERROR, error)
          commit(mutations.SET_LOADING, false)
          return false
        }
      },
    },
  }
}

export default {
  createStore,
}
