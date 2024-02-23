import { create } from 'zustand'

import { Workout } from '../database/schema/workout.schema'
import {
    getWorkouts,
    pushToServer,
    updateWorkout,
    WorkoutInput,
    WorkoutType
} from '../service/workout'
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
    updateWorkout: (id: string, params: Partial<WorkoutInput>) => Promise<void>
    deleteWorkout: (id: string) => Promise<boolean>
    incrementWorkoutSet: (id: string) => Promise<boolean>
    decrementWorkoutSet: (id: string) => Promise<boolean>
    markWorkoutAsComplete: (id: string) => Promise<boolean>
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
        return resultOffline
    },
    getWorkouts: async (page, limit) => {
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

        return Workout.getWorkouts(realm, user.id)
    },
    getWorkout: async (id) => {
        const realm = get().realm
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
        const realm = get().realm
        if (!realm) {
            console.log('Realm is not initialized!')
            return
        }
        Workout.updateWorkout(id, params, realm)
    },
    deleteWorkout: async (id) => {
        const realm = get().realm
        if (!realm) {
            console.log('Realm is not initialized!')
            return false
        }

        Workout.deleteWorkout(id, realm)

        return true
    },
    incrementWorkoutSet: async (id) => {
        const realm = get().realm
        if (!realm) {
            console.log('Realm is not initialized!')
            return false
        }

        Workout.incrementWorkoutSet(id, realm)
        return true
    },
    decrementWorkoutSet: async (id) => {
        const realm = get().realm
        if (!realm) {
            console.log('Realm is not initialized!')
            return false
        }

        Workout.decrementWorkoutSet(id, realm)
        return true
    },
    markWorkoutAsComplete: async (id) => {
        const realm = get().realm
        if (!realm) {
            console.log('Realm is not initialized!')
            return false
        }

        Workout.updateWorkout(id, { completed: true }, realm)
        return true
    },
    syncToServer: async () => {
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

        for (const workout of workouts) {
            if (workout.temp) {
                await pushToServer(workout)
                Workout.updateWorkout(workout.id, { temp: false }, realm)
            }
        }

        workoutsOnline.forEach((workout) => {
            const localWorkout = Workout.getWorkout(workout.id, realm)
            if (!localWorkout) {
                return Workout.createWorkout(workout, workout.user, realm)
            }

            const localUpdated = new Date(localWorkout.updated).getTime()
            const onlineUpdated = new Date(workout.updated).getTime()

            if (
                localUpdated < onlineUpdated &&
                localWorkout.updated !== workout.updated
            ) {
                Workout.updateWorkout(workout.id, workout, realm)
            } else if (
                localUpdated > onlineUpdated &&
                localWorkout.updated !== workout.updated
            ) {
                return updateWorkout(workout.id, localWorkout)
            }
        })
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
