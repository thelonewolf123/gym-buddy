import { debounce, isEqual } from 'lodash'
import { useCallback, useMemo } from 'react'
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
import { useConnectivity } from './useConnectivity'

type WorkoutContextType = {
    createWorkout: (params: WorkoutInput, userId: string) => WorkoutType | null
    getWorkouts: (page?: number, limit?: number) => WorkoutType[]
    getWorkout: (id: string) => WorkoutType | null
    updateWorkout: (id: string, params: Partial<WorkoutInput>) => void
    deleteWorkout: (id: string) => boolean
    incrementWorkoutSet: (id: string) => boolean
    decrementWorkoutSet: (id: string) => boolean
    markWorkoutAsComplete: (id: string) => boolean
    syncToServer: () => Promise<void> | void
}

type WorkoutContextStoreType = {
    realm: Realm | null
    user: UserType | null
    setRealm: (realm: Realm) => void
    setUser: (user: UserType) => void
}

export const useWorkoutStore = create<WorkoutContextStoreType>((set) => ({
    realm: null,
    user: null,
    setRealm: (realm) => set({ realm }),
    setUser: (user) => set({ user })
}))

const useWorkout: () => WorkoutContextType = () => {
    const { realm, user } = useWorkoutStore()
    const isConnected = useConnectivity()

    const syncToServerFn = useCallback(async () => {
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

            for (const workout of workouts) {
                if (!workout.sync) {
                    await pushToServer(workout)
                    Workout.updateWorkout(workout.id, { sync: true }, realm)
                }
            }

            function getWorkoutForComp(workout: WorkoutType) {
                return {
                    id: workout.id,
                    name: workout.name,
                    reps: workout.reps,
                    set: workout.set,
                    totalSets: workout.totalSets,
                    notes: workout.notes,
                    completed: workout.completed,
                    deleted: workout.deleted
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
                    const localWorkoutRest = getWorkoutForComp(localWorkout)
                    const onlineWorkout = getWorkoutForComp(workout)

                    if (isEqual(localWorkoutRest, onlineWorkout)) {
                        return
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
    }, [
        isConnected,
        realm,
        user,
        Workout.createWorkout,
        Workout.deleteWorkout,
        Workout.getWorkout,
        Workout.getWorkouts,
        Workout.updateWorkout
    ])

    const syncToServer = useMemo(
        () => debounce(syncToServerFn, 2_000),
        [syncToServerFn]
    )

    return {
        // Context
        syncToServer,

        // CRUD
        createWorkout: (params, userId) => {
            if (!realm) {
                console.log('Realm is not initialized!')
                return null
            }
            const resultOffline = Workout.createWorkout(params, userId, realm)
            return resultOffline
        },
        getWorkouts: (page, limit) => {
            // read

            if (!realm) {
                console.log('Realm is not initialized!')
                return []
            }

            if (!user) {
                console.log('User is not initialized!')
                return []
            }
            return Workout.getWorkouts(realm, user.id)
        },
        getWorkout: (id) => {
            // read

            if (!realm) {
                return null
            }

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
        },
        deleteWorkout: (id) => {
            if (!realm) {
                console.log('Realm is not initialized!')
                return false
            }

            Workout.deleteWorkout(id, realm)
            return true
        },
        incrementWorkoutSet: (id) => {
            if (!realm) {
                console.log('Realm is not initialized!')
                return false
            }

            Workout.incrementWorkoutSet(id, realm)
            return true
        },
        decrementWorkoutSet: (id) => {
            if (!realm) {
                console.log('Realm is not initialized!')
                return false
            }

            Workout.decrementWorkoutSet(id, realm)
            return true
        },
        markWorkoutAsComplete: (id) => {
            if (!realm) {
                console.log('Realm is not initialized!')
                return false
            }

            Workout.updateWorkout(id, { completed: true }, realm)
            return true
        }
    }
}

export default useWorkout
