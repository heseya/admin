import { DefaultParams } from '@/utils/stringifyQuery'
import { HeseyaPaginatedResponseMeta } from '@heseya/store-core'
import { ActionContext, NuxtStore } from 'typed-vuex'
import { GetterTree, MutationTree, Store } from 'vuex'
import { UUID } from './UUID'

export interface VuexBaseItem {
  id: UUID
}

export interface VuexDefaultCrudParams {
  get?: DefaultParams
  getOne?: DefaultParams
  add?: DefaultParams
  edit?: DefaultParams
  update?: DefaultParams
  remove?: DefaultParams
}

export interface DefaultVuexState<Item extends VuexBaseItem> {
  error: null | Error
  isLoading: boolean
  meta: HeseyaPaginatedResponseMeta
  data: Item[]
  queryParams: DefaultParams
  selected: Item | null
}

export interface DefaultVuexGetters<
  State extends DefaultVuexState<VuexBaseItem>,
  Item extends VuexBaseItem,
> extends GetterTree<State, any> {
  getError(state: State): Error | null
  getIsLoading(state: State): boolean
  getMeta(state: State): HeseyaPaginatedResponseMeta
  getQueryParams(state: State): DefaultParams
  getSelected(state: State): Item
  getData(state: State): Item[]
  getFromListById(state: State): (id: UUID) => Item
}

export enum DefaultVuexMutation {
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
  State extends DefaultVuexState<VuexBaseItem>,
  Item extends VuexBaseItem,
> extends MutationTree<State> {
  [DefaultVuexMutation.SetError](state: State, error: Error | null): void
  [DefaultVuexMutation.SetMeta](state: State, meta: HeseyaPaginatedResponseMeta): void
  [DefaultVuexMutation.SetQueryParams](state: State, queryParams: DefaultParams): void
  [DefaultVuexMutation.SetData](state: State, data: Item[]): void
  [DefaultVuexMutation.AddData](state: State, newItem: Item): void
  [DefaultVuexMutation.EditData](
    state: State,
    p: { key: keyof Item; value: unknown; item: Partial<Item> },
  ): void
  [DefaultVuexMutation.RemoveData](state: State, p: { key: keyof Item; value: unknown }): void
  [DefaultVuexMutation.SetSelected](state: State, selected: Item): void
  [DefaultVuexMutation.SetLoading](state: State, isLoading: boolean): void
}

// ----------------------------------------------------------------------------
// * This types are a copy of the ones in `typed-vuex`
// They are needed in vuex generator, but are not exported from `typed-vuex`

declare type Not<T, M> = T extends M ? never : T
declare type StateObject = Not<Record<string, any>, Function>
type StateFunction = Not<() => unknown | any, Record<string, any>>
declare type State = StateObject | StateFunction
declare type StateType<T extends State> = T extends () => any ? ReturnType<T> : T

interface ActionHandler<T extends NuxtStore> {
  (this: Store<StateType<T['state']>>, injectee: ActionContext<T>, payload?: any): any
}

// Renamed from ModifiedActionTree to avoid eventual name conflict
export interface InnerModifiedActionTree<T extends NuxtStore> {
  [key: string]: ActionHandler<T>
}
