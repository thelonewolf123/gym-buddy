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

type WorkoutWriteFnType = (state: WorkoutContextType) => WorkoutContextType
type WorkoutWriteObjType = WorkoutContextType | Partial<WorkoutContextType>

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
    write: (obj: WorkoutWriteFnType | WorkoutWriteObjType) => void
}

const useWorkout = create<WorkoutContextType>((set, get) => ({
    realm: null,
    isConnected: false,
    user: null,
    createWorkout: async (params, userId) => {
        const realm = get().realm
        if (!realm) {
            console.log('Realm is not initialized!')
            return null
        }
        const resultOffline = Workout.createWorkout(params, userId, realm)
        await get().syncToServer() // sync to server
        return resultOffline
    },
    getWorkouts: async (page, limit) => {
        // read
        const realm = get().realm
        const user = get().user
        if (!realm) {
            console.log('Realm is not initialized!')
            return new Promise(() => [])
        }

        if (!user) {
            console.log('User is not initialized!')
            return new Promise(() => [])
        }
        await get().syncToServer()
        return Workout.getWorkouts(realm, user.id)
    },
    getWorkout: async (id) => {
        // read
        const realm = get().realm
        if (!realm) {
            return null
        }
        await get().syncToServer()
        const workout = Workout.getWorkout(id, realm)
        if (workout) {
            return workout
        }

        return null
    },
    updateWorkout: async (id, params) => {
        const realm = get().realm
        if (!realm) {
            console.log('Realm is not initialized!')
            return
        }
        Workout.updateWorkout(id, params, realm)
        await get().syncToServer()
    },
    deleteWorkout: (id) => {
        const realm = get().realm
        if (!realm) {
            console.log('Realm is not initialized!')
            return false
        }

        Workout.deleteWorkout(id, realm)
        void get().syncToServer()
        return true
    },
    incrementWorkoutSet: (id) => {
        const realm = get().realm
        if (!realm) {
            console.log('Realm is not initialized!')
            return false
        }

        Workout.incrementWorkoutSet(id, realm)
        void get().syncToServer()
        return true
    },
    decrementWorkoutSet: (id) => {
        const realm = get().realm
        if (!realm) {
            console.log('Realm is not initialized!')
            return false
        }

        Workout.decrementWorkoutSet(id, realm)
        void get().syncToServer()
        return true
    },
    markWorkoutAsComplete: (id) => {
        const realm = get().realm
        if (!realm) {
            console.log('Realm is not initialized!')
            return false
        }

        Workout.updateWorkout(id, { completed: true }, realm)
        void get().syncToServer()
        return true
    },
    syncToServer: async () => {
        const uid = uniqueId()
        console.log('Syncing to server...', uid)
        try {
            if (!get().isConnected) {
                console.log('Not connected to the internet!')
                return
            }

            const realm = get().realm
            const user = get().user
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
    },
    write: (fn) => {
        if (typeof fn === 'function') {
            set(fn(get()))
        } else {
            set({ ...get(), ...fn })
        }
    }
}))

export default useWorkout
