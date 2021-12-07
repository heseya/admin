import { BroadcastChannel } from 'broadcast-channel'

interface Tokens {
  accessToken: string
  identityToken: string
  refreshToken: string
}

export const tokenChannel = new BroadcastChannel<Tokens | null>('token')

export const updateTokens = (tokens: Tokens | null) => {
  tokenChannel.postMessage(tokens)
}

export const onTokenUpdate = (callback: (tokens: Tokens | null) => void) => {
  tokenChannel.onmessage = (data) => {
    callback(data)
  }
}
