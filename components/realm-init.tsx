import { useEffect, useMemo } from 'react'

import { WorkoutRealmContext } from '../database/realm.db'
import useAuth from '../hooks/useAuth'
import { useConnectivity } from '../hooks/useConnectivity'
import useWorkout from '../hooks/useWorkout'

export default function RealmInit() {
    const { useRealm } = useMemo(() => WorkoutRealmContext, [])
    const { user } = useAuth()

    const realm = useRealm()
    const { setRealm, setIsConnected, setUser } = useWorkout()
    const { syncToServer } = useWorkout()
    const isConnected = useConnectivity()

    useEffect(() => {
        setRealm(realm)
        if (!user) return
        setUser(user)
    }, [realm, user])

    useEffect(() => {
        setIsConnected(isConnected)
        console.log('Connected:', isConnected)

        if (!isConnected) return
        console.log('Syncing to server...')

        syncToServer()
            .then(() => {
                console.log('Synced to server!')
            })
            .catch((err) => {
                console.error('Failed to sync to server:', err)
            })
    }, [isConnected, syncToServer, setIsConnected])

    return <></>
}
