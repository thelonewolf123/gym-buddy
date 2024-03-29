import { pb } from './index'

export type WorkoutInput = {
    name: string
    reps: number
    set: number
    notes: string
    totalSets: number
    startedAt?: Date
    completed?: boolean
}

export type WorkoutType = WorkoutInput & {
    user: string
    id: string
    sync?: boolean
    deleted?: boolean // soft delete
    created: Date
    updated: Date
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
    return pb.collection<WorkoutType>('workouts').update(id, {
        deleted: true
    })
}

export function pushToServer(workout: WorkoutType) {
    const { sync, ...rest } = workout
    console.log('Pushing to server', rest)
    return pb.collection<WorkoutType>('workouts').create(rest)
}

export function subscribeToWorkouts(
    userId: string,
    callback: (workouts: WorkoutType[]) => void
) {
    console.log('subscribeToWorkouts', userId)

    pb.collection<WorkoutType>('workouts').subscribe('*', (event) => {
        console.log('Event:', event)
        if (event.record.user === userId) {
            callback([event.record])
        }
    })

    return () => {
        pb.collection<WorkoutType>('workouts').unsubscribe()
    }
}
