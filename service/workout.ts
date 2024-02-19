import { pb } from './index'

type Workout = {
    userId: string
    name: string
    date?: Date
    reps: number
    set: number
    totalSets: number
    notes: string
}

export function createWorkout(params: Workout) {
    if (!params.date) {
        params.date = new Date()
    }

    return pb.collection('workouts').create(params)
}

export function getWorkouts() {
    return pb.collection('workouts').getList()
}

export function getWorkout(id: string) {
    return pb.collection('workouts').getOne(id)
}

export function updateWorkout(id: string, params: Partial<Workout>) {
    return pb.collection('workouts').update(id, params)
}

export function deleteWorkout(id: string) {
    return pb.collection('workouts').delete(id)
}

export function incrementWorkoutSet(id: string) {
    return pb.collection('workouts').update(id, {
        'set+': 1
    })
}
