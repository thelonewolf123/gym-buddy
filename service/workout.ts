import { pb } from './index'

export type WorkoutInput = {
    name: string
    reps: number
    set: number
    totalSets: number
    notes: string
    completed?: boolean
}

export type Workout = WorkoutInput & {
    user: string
    id: string
    created: string
    updated: string
}

export function createWorkout(params: WorkoutInput, userId: string) {
    return pb
        .collection<Workout>('workouts')
        .create({ ...params, user: userId, completed: false })
}

export function getWorkouts() {
    return pb.collection<Workout>('workouts').getList(1, 50, {
        sort: '-created'
    })
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

export function markWorkoutAsComplete(id: string) {
    return pb.collection<Workout>('workouts').update(id, {
        completed: true
    })
}
