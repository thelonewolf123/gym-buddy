import { useEffect, useRef, useState } from 'react'

import NetInfo, { NetInfoState } from '@react-native-community/netinfo'

/**
 * Returns information about internet connectivity.
 * @example const isConnected = useConnectivity();
 */
export const useConnectivity = () => {
    const [isConnected, setIsConnected] = useState(false)
    useEffect(() => {
        const connectionChangeHandler = (state: NetInfoState) => {
            setIsConnected(!!state.isConnected)
        }

        NetInfo.addEventListener(connectionChangeHandler)
    }, [])

    return isConnected
}
