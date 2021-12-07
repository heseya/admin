import { BroadcastChannel } from 'broadcast-channel'

interface Tokens {
  accessToken: string | null
  identityToken: string | null
  refreshToken: string | null
}

export const tokenChannel = new BroadcastChannel<Tokens>('token')

export const updateTokens = (tokens: Tokens) => {
  tokenChannel.postMessage(tokens)
}

export const onTokenUpdate = (callback: (tokens: Tokens) => void) => {
  tokenChannel.onmessage = (data) => {
    callback(data)
  }
}
