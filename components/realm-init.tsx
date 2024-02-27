import { useEffect, useMemo } from 'react'

import { WorkoutRealmContext } from '../database/realm.db'
import useAuth from '../hooks/useAuth'
import { useConnectivity } from '../hooks/useConnectivity'
import useWorkout, { useWorkoutStore } from '../hooks/useWorkout'
import { subscribeToWorkouts } from '../service/workout'

export default function RealmInit() {
    const { useRealm } = useMemo(() => WorkoutRealmContext, [])
    const { user } = useAuth()
    const realm = useRealm()
    const [setRealm, setIsConnected, setUser] = useWorkoutStore((s) => [
        s.setRealm,
        s.setIsConnected,
        s.setUser
    ])
    const { syncToServer, workoutList } = useWorkout()
    const isConnected = useConnectivity()

    useEffect(() => {
        setRealm(realm)
        setIsConnected(isConnected)
        if (!user) return
        setUser(user)
    }, [realm, user, isConnected])

    useEffect(() => {
        if (!user) return
        const unsubscribe = subscribeToWorkouts(user.id, (workouts) => {
            syncToServer()
        })

        return () => unsubscribe()
    }, [user, subscribeToWorkouts])

    useEffect(() => {
        if (!user) return
        syncToServer()
    }, [workoutList])

    return <></>
}
