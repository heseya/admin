import { BroadcastChannel } from 'broadcast-channel'

interface Tokens {
  accessToken: string
  identityToken: string
  refreshToken: string
}

export const tokenChannel = new BroadcastChannel<Tokens | null>('token')

export const broadcastTokensUpdate = (tokens: Tokens | null) => {
  tokenChannel.postMessage(tokens)
}

export const onTokensSync = (callback: (tokens: Tokens | null) => void) => {
  tokenChannel.onmessage = (data) => {
    callback(data)
  }
}
