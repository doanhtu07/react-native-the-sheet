import {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'
import {
  type PortalHostMap,
  type PortalHostProps,
  type PortalMap,
  type PortalProps,
  type PortalProviderProps,
} from './types'

const PortalHostsCtx = createContext<RefObject<PortalHostMap> | null>(null)

export function usePortalHosts() {
  const ctx = useContext(PortalHostsCtx)

  if (!ctx) {
    throw new Error('Portal components must be used inside <PortalProvider>')
  }

  return ctx
}

export function PortalProvider({ children }: Readonly<PortalProviderProps>) {
  const hosts = useRef<PortalHostMap>({})

  return (
    <PortalHostsCtx.Provider value={hosts}>{children}</PortalHostsCtx.Provider>
  )
}

export function PortalHost({ name, debug }: Readonly<PortalHostProps>) {
  const hosts = usePortalHosts()
  const [portals, setPortals] = useState<PortalMap>({})

  // Effect: Runs synchronously before all `useEffect`
  // PortalHost (closer to the root) always registers before any Portal child reads from it
  useLayoutEffect(() => {
    const existingHosts = hosts.current

    // Register setPortals function for this host
    existingHosts[name] = setPortals

    return () => {
      delete existingHosts[name]
    }
  }, [hosts, name])

  // Effect: Logs portals
  useEffect(() => {
    if (debug) {
      console.debug(
        `src/portal/portal.tsx - PortalHost "${name}" portals:`,
        Object.keys(portals),
      )
    }
  }, [debug, name, portals])

  return <Fragment>{Object.values(portals)}</Fragment>
}

export function Portal({ name, hostName, children }: Readonly<PortalProps>) {
  const hosts = usePortalHosts()
  const autoGenPortalName = useId()

  useEffect(() => {
    const setPortals = hosts.current[hostName]

    if (!setPortals) {
      console.warn(`No PortalHost for hostName "${hostName}"`)
      return
    }

    const portalName = name || autoGenPortalName

    setPortals((portals) => ({ ...portals, [portalName]: children }))

    return () => {
      setPortals((portals) => {
        const newPortals = { ...portals }
        delete newPortals[portalName]
        return newPortals
      })
    }
  }, [name, hostName, children, hosts, autoGenPortalName])

  return null
}
