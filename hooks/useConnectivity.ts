import { useEffect, useState } from 'react'

import NetInfo from '@react-native-community/netinfo'

/**
 * Returns information about internet connectivity.
 * @example const isConnected = useConnectivity();
 */
export const useConnectivity = () => {
    const [isConnected, setIsConnected] = useState(false)
    const state = NetInfo.useNetInfo()

    useEffect(() => {
        setIsConnected(!!state.isConnected)
    }, [state])

    return isConnected
}
