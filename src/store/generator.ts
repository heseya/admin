import axios from 'axios'
import { assign, cloneDeep, isArray, isNil } from 'lodash'
import { actionTree, getterTree, mutationTree } from 'typed-vuex'
import { ActionTree, GetterTree, MutationTree } from 'vuex'

import { api } from '../api'
import { stringifyQuery } from '@/utils/utils'

import { RootState } from '.'
import { ResponseMeta } from '@/interfaces/Response'
import { UUID } from '@/interfaces/UUID'
import { AuditEntry } from '@/interfaces/AuditEntry'
import { Metadata, MetadataDto } from '@/interfaces/Metadata'

type QueryPayload = Record<string, any>

export interface BaseItem {
  id: UUID
}

export enum StoreMutations {
  SetError = 'SET_ERROR',
  SetMeta = 'SET_META',
  SetQueryParams = 'SET_QUERY_PARAMS',
  SetData = 'SET_DATA',
  AddData = 'ADD_DATA',
  EditData = 'EDIT_DATA',
  RemoveData = 'REMOVE_DATA',
  SetSelected = 'SET_SELECTED',
  SetLoading = 'SET_LOADING',
}

interface DefaultStore<Item extends BaseItem> {
  error: null | Error
  isLoading: boolean
  meta: ResponseMeta
  data: Item[]
  queryParams: Record<string, any>
  selected: Item | null
}

interface ExtendStore<State, Item extends BaseItem> {
  state: State
  getters: GetterTree<State & DefaultStore<Item>, RootState>
  mutations: MutationTree<State & DefaultStore<Item>>
  actions: ActionTree<State & DefaultStore<Item>, RootState>
}

interface CrudParams {
  get?: QueryPayload
  add?: QueryPayload
  edit?: QueryPayload
  update?: QueryPayload
  remove?: QueryPayload
}

/**
 * Creates state, actions and mutation for CRUD methods of given entity
 * @param name - uppercased string to be used in mutation names
 * @param endpoint - CRUD API endoint for given entity type
 * @param extend - custom state, actions, mutations and getters. Are merged with genereted ones
 * @param params - fixed Query params for requests in scope
 */
export const createVuexCRUD =
  <Item extends BaseItem, CreateItemDTO = Partial<Item>, UpdateItemDTO = Partial<Item>>() =>
  <State>(endpoint: string, extend: ExtendStore<State, Item>, queryParams: CrudParams = {}) => {
    const privateState = {
      fetchAbortController: null as null | AbortController,
    }

    const moduleState = () =>
      ({
        error: null as null | Error,
        isLoading: false,
        meta: {} as ResponseMeta,
        data: [] as Item[],
        selected: null as Item | null,
        queryParams: {},
        ...(extend?.state || {}),
      } as DefaultStore<Item> & State)

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
      getQueryParams(state) {
        return state.queryParams
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

    const moduleMutations = mutationTree(moduleState, {
      [StoreMutations.SetError](state, newError: Error | null) {
        state.error = newError
      },
      [StoreMutations.SetLoading](state, isLoading: boolean) {
        state.isLoading = isLoading
      },
      [StoreMutations.SetMeta](state, newMeta: ResponseMeta) {
        state.meta = newMeta || {}
      },
      [StoreMutations.SetQueryParams](state, newParams: Record<string, any>) {
        state.queryParams = newParams || {}
      },
      [StoreMutations.SetData](state, newData: Item[] = []) {
        state.data = newData
      },
      [StoreMutations.AddData](state, newItem: Item) {
        state.data = [...state.data, newItem]
      },
      [StoreMutations.EditData](
        state,
        { key, value, item: editedItem }: { key: keyof Item; value: unknown; item: Partial<Item> },
      ) {
        if (state.selected?.[key] === value) {
          // Edits selected item
          // @ts-ignore
          state.selected = { ...state.selected, ...editedItem }
        }

        const editedItemIndex = state.data.findIndex((item) => item[key] === value)
        if (editedItemIndex >= 0) {
          // Edits any item on the list
          const copy = cloneDeep(state.data)
          copy[editedItemIndex] = { ...copy[editedItemIndex], ...editedItem }
          state.data = copy
        } else {
          // appends new item
          state.data = [...state.data, editedItem as Item]
        }
      },
      [StoreMutations.RemoveData](state, { key, value }: { key: keyof Item; value: unknown }) {
        state.data = state.data.filter((item) => item[key] !== value)
      },
      [StoreMutations.SetSelected](state, newSelected: Item) {
        state.selected = newSelected
      },
      ...(extend?.mutations || {}),
    })

    const moduleActions = actionTree(
      { state: moduleState, getters: moduleGetters, mutations: moduleMutations },
      {
        clearData({ commit }) {
          commit(StoreMutations.SetMeta, {} as ResponseMeta)
          commit(StoreMutations.SetData, [])
        },

        async fetch({ commit }, query?: QueryPayload) {
          commit(StoreMutations.SetError, null)
          commit(StoreMutations.SetLoading, true)
          try {
            privateState.fetchAbortController?.abort()
            privateState.fetchAbortController = new AbortController()

            const filteredQuery = Object.fromEntries(
              Object.entries({ ...(queryParams.get || {}), ...(query || {}) }).filter(
                ([, value]) => !isNil(value),
              ),
            )

            commit(StoreMutations.SetQueryParams, filteredQuery)

            const stringQuery = stringifyQuery(filteredQuery)

            const { data } = await api.get<{ data: Item[]; meta: ResponseMeta }>(
              `/${endpoint}${stringQuery}`,
              { signal: privateState.fetchAbortController.signal },
            )

            privateState.fetchAbortController = null

            commit(StoreMutations.SetMeta, data.meta)
            commit(StoreMutations.SetData, data.data)
            commit(StoreMutations.SetLoading, false)
            return data.data
          } catch (error: any) {
            commit(StoreMutations.SetLoading, false)
            // If request was canceled, do not report error
            if (!axios.isCancel(error)) commit(StoreMutations.SetError, error)
            return false
          }
        },
        async get({ commit }, id: string) {
          commit(StoreMutations.SetError, null)
          commit(StoreMutations.SetLoading, true)
          try {
            const stringQuery = stringifyQuery(queryParams.get || {})
            const { data } = await api.get<{ data: Item }>(`/${endpoint}/id:${id}${stringQuery}`)
            // @ts-ignore type is correct, but TS is screaming
            commit(StoreMutations.SetSelected, data.data)
            commit(StoreMutations.SetLoading, false)
            return data.data
          } catch (error: any) {
            commit(StoreMutations.SetError, error)
            commit(StoreMutations.SetLoading, false)
            return false
          }
        },

        async add({ commit }, item: CreateItemDTO) {
          commit(StoreMutations.SetError, null)
          commit(StoreMutations.SetLoading, true)
          try {
            const stringQuery = stringifyQuery(queryParams.add || {})
            const { data } = await api.post<{ data: Item }>(`/${endpoint}${stringQuery}`, item)
            // @ts-ignore type is correct, but TS is screaming
            commit(StoreMutations.AddData, data.data)
            commit(StoreMutations.SetLoading, false)
            return data.data
          } catch (error: any) {
            commit(StoreMutations.SetError, error)
            commit(StoreMutations.SetLoading, false)
            return false
          }
        },

        async edit({ commit }, { id, item }: { id: string; item: UpdateItemDTO }) {
          commit(StoreMutations.SetLoading, true)
          commit(StoreMutations.SetError, null)
          try {
            const stringQuery = stringifyQuery(queryParams.edit || {})
            const { data } = await api.put<{ data: Item }>(
              `/${endpoint}/id:${id}${stringQuery}`,
              item,
            )
            commit(StoreMutations.EditData, { key: 'id', value: id, item: data.data })
            commit(StoreMutations.SetLoading, false)
            return data.data
          } catch (error: any) {
            commit(StoreMutations.SetError, error)
            commit(StoreMutations.SetLoading, false)
            return false
          }
        },

        async update({ commit }, { id, item }: { id: string; item: Partial<UpdateItemDTO> }) {
          commit(StoreMutations.SetLoading, true)
          commit(StoreMutations.SetError, null)
          try {
            const stringQuery = stringifyQuery(queryParams.update || {})
            const { data } = await api.patch<{ data: Item }>(
              `/${endpoint}/id:${id}${stringQuery}`,
              item,
            )
            commit(StoreMutations.EditData, { key: 'id', value: id, item: data.data })
            commit(StoreMutations.SetLoading, false)
            return data.data
          } catch (error: any) {
            commit(StoreMutations.SetError, error)
            commit(StoreMutations.SetLoading, false)
            return false
          }
        },
        async updateByKey(
          { commit },
          { key, value, item }: { key: keyof Item; value: unknown; item: Partial<UpdateItemDTO> },
        ) {
          commit(StoreMutations.SetLoading, true)
          commit(StoreMutations.SetError, null)
          try {
            const stringQuery = stringifyQuery(queryParams.update || {})
            const { data } = await api.patch<{ data: Item }>(
              `/${endpoint}/${value}${stringQuery}`,
              item,
            )
            commit(StoreMutations.EditData, { key, value, item: data.data })
            commit(StoreMutations.SetLoading, false)
            return data.data
          } catch (error: any) {
            commit(StoreMutations.SetError, error)
            commit(StoreMutations.SetLoading, false)
            return false
          }
        },

        async remove({ commit }, payload: string | { value: string; params: QueryPayload }) {
          commit(StoreMutations.SetLoading, true)
          commit(StoreMutations.SetError, null)

          try {
            const id = typeof payload === 'string' ? payload : payload.value

            const payloadParams = typeof payload === 'string' ? {} : payload.params || {}
            const params = assign({}, queryParams.remove || {}, payloadParams)
            const stringQuery = stringifyQuery(params)

            await api.delete(`/${endpoint}/id:${id}${stringQuery}`)
            commit(StoreMutations.RemoveData, { key: 'id', value: id })
            commit(StoreMutations.SetLoading, false)
            return true
          } catch (error: any) {
            commit(StoreMutations.SetError, error)
            commit(StoreMutations.SetLoading, false)
            return false
          }
        },
        async removeByKey({ commit }, { key, value }: { key: keyof Item; value: unknown }) {
          commit(StoreMutations.SetLoading, true)
          commit(StoreMutations.SetError, null)
          try {
            const stringQuery = stringifyQuery(queryParams.remove || {})
            await api.delete(`/${endpoint}/${value}${stringQuery}`)
            commit(StoreMutations.RemoveData, { key, value })
            commit(StoreMutations.SetLoading, false)
            return true
          } catch (error: any) {
            commit(StoreMutations.SetError, error)
            commit(StoreMutations.SetLoading, false)
            return false
          }
        },

        // Audits
        async fetchAudits({ commit }, id: UUID) {
          commit(StoreMutations.SetError, null)
          commit(StoreMutations.SetLoading, true)
          try {
            const stringQuery = stringifyQuery(queryParams.get || {})
            const { data } = await api.get<{ data: AuditEntry[] }>(
              `/audits/${endpoint}/id:${id}${stringQuery}`,
            )
            commit(StoreMutations.SetLoading, false)
            return data.data
          } catch (error: any) {
            commit(StoreMutations.SetError, error)
            commit(StoreMutations.SetLoading, false)
            return []
          }
        },

        // Metadata
        async updateMetadata(
          { commit },
          payload: { id: UUID; metadata: MetadataDto; public: boolean },
        ) {
          commit(StoreMutations.SetError, null)
          commit(StoreMutations.SetLoading, true)
          try {
            const path = payload.public ? 'metadata' : 'metadata-private'
            const { data } = await api.patch<{ data: Metadata }>(
              `/${endpoint}/id:${payload.id}/${path}`,
              payload.metadata,
            )

            // ? Typescript is complaining, that Item does not need to have metadata, but if this method is called, it does
            // @ts-ignore
            commit(StoreMutations.EditData, {
              key: 'id',
              value: payload.id,
              // When removing all metadata, empty response is an array instead of object
              item: { [path]: isArray(data.data) ? {} : data.data },
            })
            commit(StoreMutations.SetLoading, false)
            return data.data
          } catch (error: any) {
            commit(StoreMutations.SetError, error)
            commit(StoreMutations.SetLoading, false)
            return {}
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
