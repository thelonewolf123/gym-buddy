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
    const [setRealm, setUser, setIsConnected] = useWorkoutStore((s) => [
        s.setRealm,
        s.setUser,
        s.setIsConnected
    ])
    // const { syncToServer } = useWorkout()
    // const workoutList = useWorkoutList()
    const isConnected = useConnectivity()

    useEffect(() => {
        setRealm(realm)
        setIsConnected(isConnected)
        if (!user) return
        setUser(user)
    }, [realm, user, isConnected])

    // useEffect(() => {
    //     if (!user) return
    //     if (!isConnected) return

    //     const unsubscribe = subscribeToWorkouts(user.id, (workouts) => {
    //         syncToServer()
    //     })

    //     return () => unsubscribe()
    // }, [user, subscribeToWorkouts, isConnected, syncToServer])

    // useEffect(() => {
    //     if (!user) return
    //     syncToServer()
    // }, [workoutList, syncToServer, user])

    return <></>
}
