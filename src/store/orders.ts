import { createVuexCRUD, StoreMutations } from './generator'
import { sdk } from '../api'
import {
  Order,
  OrderCreateDto,
  OrderDocument,
  OrderDocumentCreateDto,
  OrderUpdateDto,
} from '@heseya/store-core'
import { UUID } from '@/interfaces/UUID'

export type CreateOrderDocumentFunc = (payload: {
  orderId: UUID
  document: OrderDocumentCreateDto
}) => Promise<OrderDocument | null>

export type DownloadOrderDocumentFunc = (payload: {
  orderId: UUID
  documentId: UUID
}) => Promise<Blob | null>

export type SendOrderDocumentsFunc = (payload: {
  orderId: UUID
  documentIds: UUID[]
}) => Promise<boolean>

export type RemoveOrderDocumentFunc = (payload: {
  orderId: UUID
  documentId: UUID
}) => Promise<boolean>

export const orders = createVuexCRUD<Order, OrderCreateDto, OrderUpdateDto>()('orders', {
  state: {},
  getters: {},
  mutations: {
    SET_ORDER_DOCUMENTS(
      state,
      { orderId, documents }: { orderId: UUID; documents: OrderDocument[] },
    ) {
      if (state.selected?.id === orderId) state.selected.documents = documents
    },
    ADD_ORDER_DOCUMENT(state, { orderId, document }: { orderId: UUID; document: OrderDocument }) {
      if (state.selected?.id === orderId) state.selected.documents.push(document)
    },
    REMOVE_ORDER_DOCUMENT(state, { orderId, documentId }: { orderId: UUID; documentId: UUID }) {
      if (state.selected?.id === orderId)
        state.selected.documents = state.selected.documents.filter((d) => d.id !== documentId)
    },
  },
  actions: {
    async changeStatus({ commit }, { orderId, statusId }: { orderId: UUID; statusId: UUID }) {
      commit(StoreMutations.SetError, null)
      try {
        await sdk.Orders.updateStatus(orderId, { status_id: statusId })
        return true
      } catch (error: any) {
        commit(StoreMutations.SetError, error)
        return false
      }
    },

    async createOrderDocument(
      { commit },
      { orderId, document }: { orderId: UUID; document: OrderDocumentCreateDto },
    ) {
      commit(StoreMutations.SetError, null)
      try {
        const orderDocument = await sdk.Orders.Documents.create(orderId, document)

        commit('ADD_ORDER_DOCUMENT', { orderId, document: orderDocument })

        return orderDocument
      } catch (error: any) {
        commit(StoreMutations.SetError, error)
        return null
      }
    },

    async getOrderDocument(
      { commit },
      { orderId, documentId }: { orderId: UUID; documentId: UUID },
    ) {
      commit(StoreMutations.SetError, null)
      try {
        return await sdk.Orders.Documents.download(orderId, documentId)
      } catch (e) {
        commit(StoreMutations.SetError, e)
        return null
      }
    },

    async removeOrderDocument(
      { commit },
      { orderId, documentId }: { orderId: UUID; documentId: UUID },
    ) {
      commit(StoreMutations.SetError, null)
      try {
        await sdk.Orders.Documents.delete(orderId, documentId)
        commit('REMOVE_ORDER_DOCUMENT', { orderId, documentId })
        return true
      } catch (error: any) {
        commit(StoreMutations.SetError, error)
        return false
      }
    },

    async sendOrderDocuments(
      { commit },
      { orderId, documentIds }: { orderId: UUID; documentIds: UUID[] },
    ) {
      commit(StoreMutations.SetError, null)
      try {
        await sdk.Orders.Documents.send(orderId, documentIds)
        return true
      } catch (error: any) {
        commit(StoreMutations.SetError, error)
        return false
      }
    },
  },
})
