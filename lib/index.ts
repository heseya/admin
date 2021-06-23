export const initializeRepository = () => {
  // @ts-ignore
  window.isParentApp = true
  // @ts-ignore
  if (!window.microApps) window.microApps = []
}

export const findAppByHost = (host: string) => {
  // @ts-ignore
  return window.microApps.find((app) => app.host === host)
}

export const findAppByName = (name: string) => {
  // @ts-ignore
  return window.microApps.find((app) => app.name === name)
}

export const installApp = async (host: string) => {
  const { document } = window

  const scriptId = `micro-frontend-script-${host}`
  if (document.getElementById(scriptId)) {
    console.warn(`App ${host} is aleady installed`)
    return
  }

  const response = await fetch(`${host}/asset-manifest.json`)
  const manifest = await response.json()

  const script = document.createElement('script')
  script.id = scriptId
  script.type = 'module'
  script.crossOrigin = ''
  const appSrc = manifest['index.js'] || manifest['main.js'] || manifest['main.umd.min.js']

  script.src = `${host}${appSrc}`
  document.head.appendChild(script)
}

export const onRegister = (callback: (app: any) => void) => {
  const registerChannel = new BroadcastChannel('register')
  registerChannel.onmessage = (ev) => {
    const appName = ev.data.appName
    const app = findAppByName(appName)

    callback(app)

    registerChannel.close()
  }
}
