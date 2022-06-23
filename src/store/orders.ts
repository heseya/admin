import { createVuexCRUD, StoreMutations } from './generator'
import { api } from '../api'
import { Order } from '@/interfaces/Order'
import { UUID } from '@/interfaces/UUID'
import { OrderDocument, OrderDocumentDto } from '@/interfaces/OrderDocuments'

export type CreateOrderDocumentFunc = (payload: {
  orderId: UUID
  document: OrderDocumentDto
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

export const orders = createVuexCRUD<Order>()('orders', {
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
        await api.patch(`/orders/id:${orderId}/status`, { status_id: statusId })
        return true
      } catch (error: any) {
        commit(StoreMutations.SetError, error)
        return false
      }
    },

    async createOrderDocument(
      { commit },
      { orderId, document }: { orderId: UUID; document: OrderDocumentDto },
    ) {
      commit(StoreMutations.SetError, null)
      try {
        const form = new FormData()
        form.append('type', document.type)
        if (document.name) form.append('name', document.name)
        form.append('file', document.file)

        const response = await api.post<{ data: OrderDocument }>(`/orders/id:${orderId}/docs`, form)
        const orderDocument = response.data.data

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
        const response = await api.get<Blob>(
          `/orders/id:${orderId}/docs/id:${documentId}/download`,
          { responseType: 'blob' },
        )
        return response.data
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
        await api.delete(`/orders/id:${orderId}/docs/id:${documentId}`)
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
        await api.post(`/orders/id:${orderId}/docs/send`, { uuid: documentIds })
        return true
      } catch (error: any) {
        commit(StoreMutations.SetError, error)
        return false
      }
    },
  },
})
