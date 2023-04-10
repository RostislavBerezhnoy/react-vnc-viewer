import React, { useRef, useState } from 'react'
import { VncViewer } from 'lib'
import { isValid } from 'utils'

function App() {
  const [vncUrl, setVncUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const vncScreenRef = useRef<React.ElementRef<typeof VncViewer>>(null)

  return (
    <>
      <div style={{ margin: '1rem' }}>
        <label htmlFor='url'>URL for VNC Stream</label>
        <input
          type='text'
          onChange={({ target: { value } }) => setVncUrl(value)}
          name='url'
          placeholder='wss://some-vnc-url'
          style={{ width: '400px', margin: '0 1rem' }}
        />
      </div>

      <div style={{ opacity: 0.5, margin: '1rem' }}>
        Since the site is loaded over HTTPS, only `wss://` URLs (SSL encrypted websockets URLs) are
        supported.
      </div>

      <div style={{ margin: '1rem' }}>
        <button
          style={{ margin: '0 5px' }}
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
            style={
              loading
                ? {
                    width: '100%',
                    height: '0',
                  }
                : {
                    width: '1024px',
                    height: '768px',
                  }
            }
            debug
            ref={vncScreenRef}
            loader={<p>Loading vnc screen...</p>}
            onConnect={() => setLoading(false)}
          />
        ) : (
          <p>VNC URL has not been provided</p>
        )}
      </div>
    </>
  )
}

export default App
