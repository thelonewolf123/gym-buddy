import { useEffect, useMemo } from 'react'

import { WorkoutRealmContext } from '../database/realm.db'
import useAuth from '../hooks/useAuth'
import { useConnectivity } from '../hooks/useConnectivity'
import useWorkout from '../hooks/useWorkout'

export default function RealmInit() {
    const { useRealm } = useMemo(() => WorkoutRealmContext, [])
    const { user } = useAuth()

    const realm = useRealm()
    const writeWorkout = useWorkout((s) => s.write)
    const syncToServer = useWorkout((s) => s.syncToServer)
    const isConnected = useConnectivity()

    useEffect(() => {
        writeWorkout({ realm: realm, user: user })
    }, [realm, writeWorkout, user])

    useEffect(() => {
        writeWorkout({ isConnected: isConnected })
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
    }, [isConnected, syncToServer, writeWorkout])

    return <></>
}
