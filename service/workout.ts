import { pb } from './index'

export type WorkoutInput = {
    name: string
    reps: number
    set: number
    totalSets: number
    notes: string
    completed?: boolean
}

export type WorkoutType = WorkoutInput & {
    user: string
    id: string
    temp?: boolean
    deleted?: boolean
    created: string
    updated: string
}

export function createWorkout(params: WorkoutInput, userId: string) {
    return pb
        .collection<WorkoutType>('workouts')
        .create({ ...params, user: userId, completed: false })
}

export function getWorkouts(page: number = 1, limit: number = 50000) {
    return pb
        .collection<WorkoutType>('workouts')
        .getList(page, limit, {
            sort: '-created'
        })
        .then((result) => {
            return result.items
        })
}

export function getWorkout(id: string) {
    return pb.collection<WorkoutType>('workouts').getOne(id)
}

export function updateWorkout(id: string, params: Partial<WorkoutInput>) {
    return pb.collection<WorkoutType>('workouts').update(id, params)
}

export function deleteWorkout(id: string) {
    return pb.collection<WorkoutType>('workouts').delete(id)
}

export function incrementWorkoutSet(id: string) {
    return pb.collection<WorkoutType>('workouts').update(id, {
        'set+': 1
    })
}

export function decrementWorkoutSet(id: string) {
    return pb.collection<WorkoutType>('workouts').update(id, {
        'set-': 1
    })
}

export function markWorkoutAsComplete(id: string) {
    return pb.collection<WorkoutType>('workouts').update(id, {
        completed: true
    })
}

export function pushToServer(workout: WorkoutType) {
    const { temp, ...rest } = workout
    console.log('Pushing to server', rest)
    return pb.collection<WorkoutType>('workouts').create(rest)
}
