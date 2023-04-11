/* eslint-disable @typescript-eslint/no-shadow */
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  ForwardRefRenderFunction,
} from 'react'
import RFB, { NoVncCredentials } from '@novnc/novnc/core/rfb'
import { VncViewerProps, VncViewerHandle, EventListeners, Events } from './types'

const VncViewer: ForwardRefRenderFunction<VncViewerHandle, VncViewerProps> = (
  {
    url,
    style,
    className,
    viewOnly,
    rfbOptions,
    focusOnClick,
    clipViewport,
    dragViewport,
    scaleViewport,
    resizeSession,
    showDotCursor,
    background,
    qualityLevel,
    compressionLevel,
    autoConnect = true,
    retryDuration = 3000,
    debug = false,
    loader,
    onConnect,
    onDisconnect,
    onCredentialsRequired,
    onSecurityFailure,
    onClipboard,
    onBell,
    onDesktopName,
    onCapabilities,
  },
  ref,
) => {
  const rfb = useRef<RFB | null>(null)
  const connected = useRef<boolean>(autoConnect)
  const timeouts = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const eventListeners = useRef<EventListeners>({})
  const screen = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const logger = {
    log: (...args: any[]) => {
      if (debug) console.log(...args)
    },
    info: (...args: any[]) => {
      if (debug) console.info(...args)
    },
    error: (...args: any[]) => {
      if (debug) console.error(...args)
    },
  }

  const getRfb = () => rfb.current

  const setRfb = (_rfb: RFB | null) => (rfb.current = _rfb)

  const getConnected = () => connected.current

  const setConnected = (state: boolean) => (connected.current = state)

  const _onConnect = () => {
    const rfb = getRfb()

    if (onConnect) {
      onConnect(rfb ?? undefined)
      setLoading(false)
    }

    logger.info('Connected to remote VNC.')
    setLoading(false)
  }

  const _onDisconnect = () => {
    const rfb = getRfb()

    if (onDisconnect) {
      onDisconnect(rfb ?? undefined)
      setLoading(true)
    }

    const connected = getConnected()

    if (connected) {
      logger.info(
        `Unexpectedly disconnected from remote VNC, retrying in ${retryDuration / 1000} seconds.`,
      )

      timeouts.current.push(setTimeout(connect, retryDuration))
    } else {
      logger.info('Disconnected from remote VNC.')
    }

    setLoading(true)
  }

  const _onCredentialsRequired = () => {
    const rfb = getRfb()

    if (onCredentialsRequired) onCredentialsRequired(rfb ?? undefined)

    const password = rfbOptions?.credentials?.password ?? prompt('Password Required:')

    if (password) rfb?.sendCredentials({ password: password } as NoVncCredentials)
  }

  const _onDesktopName = (e: { detail: { name: string } }) => {
    if (onDesktopName) onDesktopName(e)

    logger.info(`Desktop name is ${e.detail.name}`)
  }

  const disconnect = () => {
    let rfb = getRfb()

    try {
      if (rfb) {
        timeouts.current.forEach(id => clearTimeout(id))
        ;(Object.keys(eventListeners.current) as (keyof typeof Events)[]).forEach(event => {
          if (eventListeners.current[event]) {
            rfb?.removeEventListener(event, eventListeners.current[event] as any)
            eventListeners.current[event] = undefined
          }
        })
        rfb.disconnect()
        rfb = null
        setRfb(null)
        setConnected(false)

        // NOTE: This needs to be called since the event listener is removed.
        // Even if the event listener is removed after rfb.disconnect(), the disconnect
        // event is not fired.
        _onDisconnect()
      }
    } catch (error) {
      logger.error(error)
      setRfb(null)
      setConnected(false)
    }
  }

  //eslint-disable-next-line sonarjs/cognitive-complexity
  const connect = () => {
    try {
      if (connected && !!rfb) disconnect()

      if (screen.current) {
        screen.current.innerHTML = ''

        const _rfb = new RFB(screen.current, url, rfbOptions)

        _rfb.viewOnly = viewOnly ?? false
        _rfb.focusOnClick = focusOnClick ?? false
        _rfb.clipViewport = clipViewport ?? false
        _rfb.dragViewport = dragViewport ?? false
        _rfb.resizeSession = resizeSession ?? false
        _rfb.scaleViewport = scaleViewport ?? false
        _rfb.showDotCursor = showDotCursor ?? false
        _rfb.background = background ?? ''
        _rfb.qualityLevel = qualityLevel ?? 6
        _rfb.compressionLevel = compressionLevel ?? 2
        setRfb(_rfb)

        eventListeners.current.connect = _onConnect
        eventListeners.current.disconnect = _onDisconnect
        eventListeners.current.credentialsrequired = _onCredentialsRequired
        eventListeners.current.securityfailure = onSecurityFailure
        eventListeners.current.clipboard = onClipboard
        eventListeners.current.bell = onBell
        eventListeners.current.desktopname = _onDesktopName
        eventListeners.current.capabilities = onCapabilities
        ;(Object.keys(eventListeners.current) as (keyof typeof Events)[]).forEach(event => {
          if (eventListeners.current[event]) {
            _rfb.addEventListener(event, eventListeners.current[event] as any)
          }
        })

        setConnected(true)
      }
    } catch (error) {
      logger.error(error)
    }
  }

  const sendCredentials = (credentials: NoVncCredentials) => {
    const rfb = getRfb()
    rfb?.sendCredentials(credentials)
  }

  const sendKey = (keysym: number, code: string, down?: boolean) => {
    const rfb = getRfb()
    rfb?.sendKey(keysym, code, down)
  }

  const sendCtrlAltDel = () => {
    const rfb = getRfb()
    rfb?.sendCtrlAltDel()
  }

  const focus = () => {
    const rfb = getRfb()
    rfb?.focus()
  }

  const blur = () => {
    const rfb = getRfb()
    rfb?.blur()
  }

  const machineShutdown = () => {
    const rfb = getRfb()
    rfb?.machineShutdown()
  }

  const machineReboot = () => {
    const rfb = getRfb()
    rfb?.machineReboot()
  }

  const machineReset = () => {
    const rfb = getRfb()
    rfb?.machineReset()
  }

  const clipboardPaste = (text: string) => {
    const rfb = getRfb()
    rfb?.clipboardPasteFrom(text)
  }

  useImperativeHandle(ref, () => ({
    connect,
    disconnect,
    connected: connected.current,
    sendCredentials,
    sendKey,
    sendCtrlAltDel,
    focus,
    blur,
    machineShutdown,
    machineReboot,
    machineReset,
    clipboardPaste,
    rfb: rfb.current,
    eventListeners: eventListeners.current,
  }))

  useEffect(() => {
    if (autoConnect) connect()

    return disconnect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = () => {
    const rfb = getRfb()

    if (rfb) rfb.focus()
  }

  const handleMouseEnter = () => {
    if (document.activeElement && document.activeElement instanceof HTMLElement)
      document.activeElement.blur()

    handleClick()
  }

  const handleMouseLeave = () => {
    const rfb = getRfb()

    if (rfb) rfb.blur()
  }

  return (
    <>
      {(loading || !url) && (loader ?? <p>Loading...</p>)}
      {url && (
        <div
          style={style}
          className={className}
          ref={screen}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </>
  )
}

export default forwardRef(VncViewer)
