import React, { useRef, useState } from 'react'
import { VncViewer } from 'lib'
import { isValid } from 'utils'

export const Spacer = () => <div style={{ width: '2rem', display: 'inline-block' }} />

function App() {
  const [vncUrl, setVncUrl] = useState('')
  const [inputUrl, setInputUrl] = useState('')
  const vncScreenRef = useRef<React.ElementRef<typeof VncViewer>>(null)

  return (
    <>
      <div style={{ margin: '1rem' }}>
        <label htmlFor='url'>URL for VNC Stream</label>
        <Spacer />

        <input
          type='text'
          onChange={({ target: { value } }) => {
            setInputUrl(value)
          }}
          name='url'
          placeholder='wss://your-vnc-url'
        />

        <Spacer />
        <button onClick={() => setVncUrl(inputUrl)}>Go!</button>
      </div>

      <div style={{ opacity: 0.5, margin: '1rem' }}>
        Since the site is loaded over HTTPS, only `wss://` URLs (SSL encrypted websockets URLs) are
        supported.
      </div>

      <div style={{ margin: '1rem' }}>
        <button
          onClick={() => {
            const { connect, connected, disconnect } = vncScreenRef.current ?? {}

            if (connected) disconnect?.()
            else connect?.()
          }}
        >
          Connect / Disconnect
        </button>
      </div>

      <div style={{ margin: '1rem' }}>
        {isValid(vncUrl) ? (
          <VncViewer
            url={vncUrl}
            style={{
              width: '1024px',
              height: '768px',
            }}
            debug
            ref={vncScreenRef}
          />
        ) : (
          <div>VNC URL not provided.</div>
        )}
      </div>
    </>
  )
}

export default App
