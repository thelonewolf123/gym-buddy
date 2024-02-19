import { pb } from './index'

export type WorkoutInput = {
    name: string
    reps: number
    set: number
    totalSets: number
    notes: string
}

export type Workout = WorkoutInput & {
    userId: string
    id: string
    created: string
    updated: string
}

export function createWorkout(params: WorkoutInput) {
    return pb.collection('workouts').create(params)
}

export function getWorkouts() {
    return pb.collection<Workout>('workouts').getList()
}

export function getWorkout(id: string) {
    return pb.collection<Workout>('workouts').getOne(id)
}

export function updateWorkout(id: string, params: Partial<WorkoutInput>) {
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

export function decrementWorkoutSet(id: string) {
    return pb.collection<Workout>('workouts').update(id, {
        'set-': 1
    })
}
