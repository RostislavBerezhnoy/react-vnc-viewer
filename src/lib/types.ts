import { ReactNode } from 'react'
import RFB, { NoVncOptions, NoVncCredentials } from '@novnc/novnc/core/rfb'

export type rfbOptions = Partial<NoVncOptions>

export type VncViewerProps = {
  url: string
  style?: object
  className?: string
  viewOnly?: boolean
  rfbOptions?: rfbOptions
  focusOnClick?: boolean
  clipViewport?: boolean
  dragViewport?: boolean
  scaleViewport?: boolean
  resizeSession?: boolean
  showDotCursor?: boolean
  background?: string
  qualityLevel?: number
  compressionLevel?: number
  autoConnect?: boolean
  retryDuration?: number
  debug?: boolean
  loader?: ReactNode
  onConnect?: (rfb?: RFB) => void
  onDisconnect?: (rfb?: RFB) => void
  onCredentialsRequired?: (rfb?: RFB) => void
  onSecurityFailure?: (e?: { detail: { status: number; reason: string } }) => void
  onClipboard?: (e?: { detail: { text: string } }) => void
  onBell?: () => void
  onDesktopName?: (e?: { detail: { name: string } }) => void
  onCapabilities?: (e?: { detail: { capabilities: RFB['capabilities'] } }) => void
}

export type VncViewerHandle = {
  connect: () => void
  disconnect: () => void
  connected: boolean
  sendCredentials: (credentials: NoVncCredentials) => void
  sendKey: (keysym: number, code: string, down?: boolean) => void
  sendCtrlAltDel: () => void
  focus: () => void
  blur: () => void
  machineShutdown: () => void
  machineReboot: () => void
  machineReset: () => void
  clipboardPaste: (text: string) => void
  rfb: RFB | null
  eventListeners: EventListeners
}

export type EventListeners = { -readonly [key in keyof typeof Events]?: (e?: any) => void }

export enum Events {
  connect,
  disconnect,
  credentialsrequired,
  securityfailure,
  clipboard,
  bell,
  desktopname,
  capabilities,
}
