import { pb } from './index'

export type Workout = {
    userId: string
    name: string
    reps: number
    set: number
    totalSets: number
    notes: string
    // auto-generated fields
    id?: string
    created?: string
    updated?: string
}

export function createWorkout(params: Workout) {
    return pb.collection('workouts').create(params)
}

export function getWorkouts() {
    return pb.collection<Workout>('workouts').getList()
}

export function getWorkout(id: string) {
    return pb.collection<Workout>('workouts').getOne(id)
}

export function updateWorkout(id: string, params: Partial<Workout>) {
    return pb.collection<Workout>('workouts').update(id, params)
}

export function deleteWorkout(id: string) {
    return pb.collection<Workout>('workouts').delete(id)
}

export function incrementWorkoutSet(id: string) {
    return pb.collection<Workout>('workouts').update(id, {
        'set+': 1
    })
}
