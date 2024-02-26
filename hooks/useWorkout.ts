import { useState } from 'react'
import { create } from 'zustand'

import { Workout } from '../database/schema/workout.schema'
import {
    deleteWorkout,
    getWorkouts,
    pushToServer,
    updateWorkout,
    WorkoutInput,
    WorkoutType
} from '../service/workout'
import { uniqueId } from '../utils'
import { UserType } from './useAuth'

type WorkoutContextType = {
    realm: Realm | null
    isConnected: boolean
    user: UserType | null
    createWorkout: (
        params: WorkoutInput,
        userId: string
    ) => Promise<WorkoutType | null>
    getWorkouts: (page?: number, limit?: number) => Promise<WorkoutType[]>
    getWorkout: (id: string) => Promise<WorkoutType | null>
    updateWorkout: (id: string, params: Partial<WorkoutInput>) => void
    deleteWorkout: (id: string) => boolean
    incrementWorkoutSet: (id: string) => boolean
    decrementWorkoutSet: (id: string) => boolean
    markWorkoutAsComplete: (id: string) => boolean
    syncToServer: () => Promise<void>
    setRealm: (realm: Realm) => void
    setIsConnected: (isConnected: boolean) => void
    setUser: (user: UserType) => void
}

const useWorkout: () => WorkoutContextType = () => {
    const [realm, setRealm] = useState<Realm | null>(null)
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [user, setUser] = useState<UserType | null>(null)

    const syncToServer = async () => {
        const uid = uniqueId()
        console.log('Syncing to server...', uid)
        try {
            if (!isConnected) {
                console.log('Not connected to the internet!')
                return
            }

            if (!realm) {
                console.log('Realm is not initialized!')
                return
            }

            if (!user) {
                console.log('User is not initialized!')
                return
            }

            const workouts = Workout.getWorkouts(realm, user.id)
            const workoutsOnline = await getWorkouts()
            console.log('workoutsOnline', workoutsOnline)
            console.log('workouts', workouts)

            for (const workout of workouts) {
                if (!workout.sync) {
                    await pushToServer(workout)
                    Workout.updateWorkout(workout.id, { sync: true }, realm)
                }
            }

            await Promise.all(
                workoutsOnline.map(async (workout) => {
                    const localWorkout = Workout.getWorkout(workout.id, realm)
                    if (!localWorkout) {
                        workout.sync = true
                        return Workout.createWorkout(
                            workout,
                            workout.user,
                            realm
                        )
                    }

                    if (workout.deleted) {
                        Workout.deleteWorkout(workout.id, realm)
                        return
                    }

                    const localUpdated = new Date(
                        localWorkout.updated
                    ).getTime()
                    const onlineUpdated = new Date(workout.updated).getTime()

                    if (localWorkout.deleted) {
                        await deleteWorkout(workout.id)
                        return
                    }

                    if (
                        localUpdated < onlineUpdated &&
                        localWorkout.updated !== workout.updated
                    ) {
                        Workout.updateWorkout(workout.id, workout, realm)
                    } else if (
                        localUpdated > onlineUpdated &&
                        localWorkout.updated !== workout.updated
                    ) {
                        await updateWorkout(workout.id, localWorkout)
                    }
                })
            )
            console.log('Synced to server!', uid)
        } catch (error: any) {
            console.log('Error in sync to server: ', error.originalError)
        }
    }

    return {
        realm: null,
        isConnected: false,
        user: null,
        setRealm,
        setIsConnected,
        setUser,
        createWorkout: async (params, userId) => {
            if (!realm) {
                console.log('Realm is not initialized!')
                return null
            }
            const resultOffline = Workout.createWorkout(params, userId, realm)
            await syncToServer() // sync to server
            return resultOffline
        },
        getWorkouts: async (page, limit) => {
            // read

            if (!realm) {
                console.log('Realm is not initialized!')
                return new Promise(() => [])
            }

            if (!user) {
                console.log('User is not initialized!')
                return new Promise(() => [])
            }
            await syncToServer()
            return Workout.getWorkouts(realm, user.id)
        },
        getWorkout: async (id) => {
            // read

            if (!realm) {
                return null
            }
            await syncToServer()
            const workout = Workout.getWorkout(id, realm)
            if (workout) {
                return workout
            }

            return null
        },
        updateWorkout: async (id, params) => {
            if (!realm) {
                console.log('Realm is not initialized!')
                return
            }
            Workout.updateWorkout(id, params, realm)
            await syncToServer()
        },
        deleteWorkout: (id) => {
            if (!realm) {
                console.log('Realm is not initialized!')
                return false
            }

            Workout.deleteWorkout(id, realm)
            void syncToServer()
            return true
        },
        incrementWorkoutSet: (id) => {
            if (!realm) {
                console.log('Realm is not initialized!')
                return false
            }

            Workout.incrementWorkoutSet(id, realm)
            void syncToServer()
            return true
        },
        decrementWorkoutSet: (id) => {
            if (!realm) {
                console.log('Realm is not initialized!')
                return false
            }

            Workout.decrementWorkoutSet(id, realm)
            void syncToServer()
            return true
        },
        markWorkoutAsComplete: (id) => {
            if (!realm) {
                console.log('Realm is not initialized!')
                return false
            }

            Workout.updateWorkout(id, { completed: true }, realm)
            void syncToServer()
            return true
        },
        syncToServer
    }
}

export default useWorkout
