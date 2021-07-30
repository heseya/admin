import queryString from 'query-string'
import { cloneDeep, isNil } from 'lodash'
import { actionTree, getterTree, mutationTree } from 'typed-vuex'
import { ActionTree, GetterTree, MutationTree } from 'vuex'

import { api } from '../api'

import { RootState } from '.'
import { ResponseMeta } from '@/interfaces/Response'
import { ID } from '@/interfaces/ID'

interface DefaultStore<Item> {
  error: null | Error
  isLoading: boolean
  meta: ResponseMeta
  data: Item[]
  selected: Item
}

interface ExtendStore<S, Item> {
  state: S
  getters: GetterTree<S & DefaultStore<Item>, RootState>
  mutations: MutationTree<S & DefaultStore<Item>>
  actions: ActionTree<S & DefaultStore<Item>, RootState>
}

interface CrudParams {
  get?: Record<string, any>
  add?: Record<string, any>
  edit?: Record<string, any>
  update?: Record<string, any>
  remove?: Record<string, any>
}

/**
 * Creates state, actions and mutation for CRUD methods of given entity
 * @param name - uppercased string to be used in mutation names
 * @param endpoint - CRUD API endoint for given entity type
 * @param extend - custom state, actions, mutations and getters. Are merged with genereted ones
 */
export const createVuexCRUD =
  <Item extends { id: ID }>() =>
  <S extends {} = {}>(endpoint: string, extend: ExtendStore<S, Item>, params: CrudParams = {}) => {
    const mutationsNames = {
      SET_ERROR: 'SET_ERROR',
      SET_META: 'SET_META',
      SET_DATA: 'SET_DATA',
      ADD_DATA: 'ADD_DATA',
      EDIT_DATA: 'EDIT_DATA',
      REMOVE_DATA: 'REMOVE_DATA',
      SET_SELECTED: 'SET_SELECTED',
      SET_LOADING: 'SET_LOADING',
    }

    const moduleState = () =>
      ({
        error: null as null | Error,
        isLoading: false,
        meta: {} as ResponseMeta,
        data: [] as Item[],
        selected: {} as Item,
        ...(extend?.state || {}),
      } as DefaultStore<Item> & S)

    const moduleGetters = getterTree(moduleState, {
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
        return (searchedId: string) =>
          ({ ...state.data.find(({ id }) => id === searchedId) } as Item)
      },
      ...(extend?.getters || {}),
    })

    // @ts-ignore
    const moduleMutations = mutationTree(moduleState, {
      [mutationsNames.SET_ERROR](state, newError: Error) {
        state.error = newError
      },
      [mutationsNames.SET_LOADING](state, isLoading: boolean) {
        state.isLoading = isLoading
      },
      [mutationsNames.SET_META](state, newMeta: ResponseMeta) {
        state.meta = newMeta
      },
      [mutationsNames.SET_DATA](state, newData: Item[] = []) {
        state.data = newData
      },
      [mutationsNames.ADD_DATA](state, newItem: Item) {
        state.data = [...state.data, newItem]
      },
      [mutationsNames.EDIT_DATA](
        state,
        { key, value, item: editedItem }: { key: keyof Item; value: unknown; item: Item },
      ) {
        const editedItemIndex = state.data.findIndex((item) => item[key] === value)
        if (editedItemIndex >= 0) {
          // Edits any item on the list
          const copy = cloneDeep(state.data)
          copy[editedItemIndex] = editedItem
          state.data = copy
        } else if (state.selected[key] === value) {
          // Edits selected item
          state.selected = editedItem
        } else {
          // appends new item
          state.data = [...state.data, editedItem]
        }
      },
      [mutationsNames.REMOVE_DATA](state, { key, value }: { key: keyof Item; value: unknown }) {
        state.data = state.data.filter((item) => item[key] !== value)
      },
      [mutationsNames.SET_SELECTED](state, newSelected: Item) {
        state.selected = newSelected
      },
      ...(extend?.mutations || {}),
    })

    const moduleActions = actionTree(
      { state: moduleState, getters: moduleGetters, mutations: moduleMutations },
      {
        clearData({ commit }) {
          commit(mutationsNames.SET_META, {})
          commit(mutationsNames.SET_DATA, [])
        },

        async fetch({ commit }, query?: Record<string, any>) {
          commit(mutationsNames.SET_ERROR, null)
          commit(mutationsNames.SET_LOADING, true)
          try {
            const filteredQuery = Object.fromEntries(
              Object.entries(query || {}).filter(([key, value]) => !isNil(value)),
            )
            const stringQuery = queryString.stringify({ ...(params.get || {}), ...filteredQuery })

            const { data } = await api.get(`/${endpoint}?${stringQuery}`)
            commit(mutationsNames.SET_META, data.meta)
            commit(mutationsNames.SET_DATA, data.data)
            commit(mutationsNames.SET_LOADING, false)
            return true
          } catch (error) {
            commit(mutationsNames.SET_ERROR, error)
            commit(mutationsNames.SET_LOADING, false)
            return false
          }
        },
        async get({ commit }, id: string) {
          commit(mutationsNames.SET_ERROR, null)
          commit(mutationsNames.SET_LOADING, true)
          try {
            const stringQuery = queryString.stringify(params.get || {})
            const { data: responseData } = await api.get(`/${endpoint}/id:${id}?${stringQuery}`)
            commit(mutationsNames.SET_SELECTED, responseData.data)
            commit(mutationsNames.SET_LOADING, false)
            return true
          } catch (error) {
            commit(mutationsNames.SET_ERROR, error)
            commit(mutationsNames.SET_LOADING, false)
            return false
          }
        },

        async add({ commit }, item: Partial<Item>) {
          commit(mutationsNames.SET_ERROR, null)
          commit(mutationsNames.SET_LOADING, true)
          try {
            const stringQuery = queryString.stringify(params.add || {})
            const { data } = await api.post(`/${endpoint}?${stringQuery}`, item)
            commit(mutationsNames.ADD_DATA, data.data)
            commit(mutationsNames.SET_LOADING, false)
            return data.data
          } catch (error) {
            commit(mutationsNames.SET_ERROR, error)
            commit(mutationsNames.SET_LOADING, false)
            return false
          }
        },

        async edit({ commit }, { id, item }: { id: string; item: Partial<Item> }) {
          commit(mutationsNames.SET_LOADING, true)
          commit(mutationsNames.SET_ERROR, null)
          try {
            const stringQuery = queryString.stringify(params.edit || {})
            const { data } = await api.put(`/${endpoint}/id:${id}?${stringQuery}`, item)
            commit(mutationsNames.EDIT_DATA, { key: 'id', value: id, item: data.data })
            commit(mutationsNames.SET_LOADING, false)
            return data.data
          } catch (error) {
            commit(mutationsNames.SET_ERROR, error)
            commit(mutationsNames.SET_LOADING, false)
            return false
          }
        },

        async update({ commit }, { id, item }: { id: string; item: Partial<Item> }) {
          commit(mutationsNames.SET_LOADING, true)
          commit(mutationsNames.SET_ERROR, null)
          try {
            const stringQuery = queryString.stringify(params.update || {})
            const { data } = await api.patch(`/${endpoint}/id:${id}?${stringQuery}`, item)
            commit(mutationsNames.EDIT_DATA, { key: 'id', value: id, item: data.data })
            commit(mutationsNames.SET_LOADING, false)
            return data.data
          } catch (error) {
            commit(mutationsNames.SET_ERROR, error)
            commit(mutationsNames.SET_LOADING, false)
            return false
          }
        },
        async updateByKey(
          { commit },
          { key, value, item }: { key: keyof Item; value: unknown; item: Partial<Item> },
        ) {
          commit(mutationsNames.SET_LOADING, true)
          commit(mutationsNames.SET_ERROR, null)
          try {
            const stringQuery = queryString.stringify(params.update || {})
            const { data } = await api.patch(`/${endpoint}/${value}?${stringQuery}`, item)
            commit(mutationsNames.EDIT_DATA, { key, value, item: data.data })
            commit(mutationsNames.SET_LOADING, false)
            return data.data
          } catch (error) {
            commit(mutationsNames.SET_ERROR, error)
            commit(mutationsNames.SET_LOADING, false)
            return false
          }
        },

        async remove({ commit }, id: string) {
          commit(mutationsNames.SET_LOADING, true)
          commit(mutationsNames.SET_ERROR, null)
          try {
            const stringQuery = queryString.stringify(params.remove || {})
            await api.delete(`/${endpoint}/id:${id}?${stringQuery}`)
            commit(mutationsNames.REMOVE_DATA, { key: 'id', value: id })
            commit(mutationsNames.SET_LOADING, false)
            return true
          } catch (error) {
            commit(mutationsNames.SET_ERROR, error)
            commit(mutationsNames.SET_LOADING, false)
            return false
          }
        },
        async removeByKey({ commit }, { key, value }: { key: keyof Item; value: unknown }) {
          commit(mutationsNames.SET_LOADING, true)
          commit(mutationsNames.SET_ERROR, null)
          try {
            const stringQuery = queryString.stringify(params.remove || {})
            await api.delete(`/${endpoint}/${value}?${stringQuery}`)
            commit(mutationsNames.REMOVE_DATA, { key, value })
            commit(mutationsNames.SET_LOADING, false)
            return true
          } catch (error) {
            commit(mutationsNames.SET_ERROR, error)
            commit(mutationsNames.SET_LOADING, false)
            return false
          }
        },
        ...(extend?.actions || {}),
      },
    )

    return {
      namespaced: true,
      state: moduleState,
      getters: moduleGetters,
      mutations: moduleMutations,
      actions: moduleActions,
    }
  }

export default {
  createVuexCRUD,
}
