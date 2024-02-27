import { useEffect, useMemo } from 'react'

import { WorkoutRealmContext } from '../database/realm.db'
import useAuth from '../hooks/useAuth'
import { useConnectivity } from '../hooks/useConnectivity'
import useWorkout, { useWorkoutStore } from '../hooks/useWorkout'
import { useWorkoutList } from '../hooks/useWorkoutList'
import { subscribeToWorkouts } from '../service/workout'

export default function RealmInit() {
    const { useRealm } = useMemo(() => WorkoutRealmContext, [])
    const { user } = useAuth()
    const realm = useRealm()
    const [setRealm, setUser] = useWorkoutStore((s) => [s.setRealm, s.setUser])
    const { syncToServer } = useWorkout()
    const workoutList = useWorkoutList()
    const isConnected = useConnectivity()

    useEffect(() => {
        setRealm(realm)
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
