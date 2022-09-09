import { HeseyaPaginatedResponseMeta } from '@heseya/store-core'
import { GetterTree, MutationTree } from 'vuex'
import { UUID } from './UUID'

type QueryParams = Record<string, any>

export interface BaseItem {
  id: UUID
}

export interface VuexDefaultCrudParams {
  get?: QueryParams
  add?: QueryParams
  edit?: QueryParams
  update?: QueryParams
  remove?: QueryParams
}

export interface DefaultVuexState<Item extends BaseItem> {
  error: null | Error
  isLoading: boolean
  meta: HeseyaPaginatedResponseMeta
  data: Item[]
  queryParams: QueryParams
  selected: Item | null
}

export interface DefaultVuexGetters<State extends DefaultVuexState<BaseItem>, Item extends BaseItem>
  extends GetterTree<State, any> {
  getError(state: State): Error | null
  getIsLoading(state: State): boolean
  getMeta(state: State): HeseyaPaginatedResponseMeta
  getQueryParams(state: State): QueryParams
  getSelected(state: State): Item
  getData(state: State): Item[]
  getFromListById(state: State): (id: UUID) => Item
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

export interface DefaultVuexMutations<
  State extends DefaultVuexState<BaseItem>,
  Item extends BaseItem,
> extends MutationTree<State> {
  [StoreMutations.SetError](state: State, error: Error | null): void
  [StoreMutations.SetMeta](state: State, meta: HeseyaPaginatedResponseMeta): void
  [StoreMutations.SetQueryParams](state: State, queryParams: QueryParams): void
  [StoreMutations.SetData](state: State, data: Item[]): void
  [StoreMutations.AddData](state: State, newItem: Item): void
  [StoreMutations.EditData](
    state: State,
    p: { key: keyof Item; value: unknown; item: Partial<Item> },
  ): void
  [StoreMutations.RemoveData](state: State, p: { key: keyof Item; value: unknown }): void
  [StoreMutations.SetSelected](state: State, selected: Item): void
  [StoreMutations.SetLoading](state: State, isLoading: boolean): void
}

// interface DefaultVuexActions<Item extends BaseItem, CreateItemDTO, UpdateItemDTO> {}
// interface DefaultVuexActions<State extends DefaultVuexState<BaseItem>> {
//   get({ commit, state }: { commit: any; state: State }, params?: QueryParams): Promise<void>
//   add({ commit, state }: { commit: any; state: State }, params?: QueryParams): Promise<void>
//   edit({ commit, state }: { commit: any; state: State }, params?: QueryParams): Promise<void>
//   update({ commit, state }: { commit: any; state: State }, params?: QueryParams): Promise<void>
//   remove({ commit, state }: { commit: any; state: State }, params?: QueryParams): Promise<void>
// }
