import { useEffect, useMemo } from 'react'

import { WorkoutRealmContext } from '../database/realm.db'
import { useConnectivity } from '../hooks/useConnectivity'
import { useWorkoutStore } from '../hooks/useWorkout'

export default function RealmInit() {
    const { useRealm } = useMemo(() => WorkoutRealmContext, [])
    const realm = useRealm()
    const [setRealm, setIsConnected] = useWorkoutStore((s) => [
        s.setRealm,
        s.setIsConnected
    ])

    const isConnected = useConnectivity()

    useEffect(() => {
        setRealm(realm)
        setIsConnected(isConnected)
    }, [realm, isConnected])

    return <></>
}
