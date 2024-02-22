import { UpdateMode } from 'realm/dist/bundle'

import { Realm } from '@realm/react'

import { WorkoutType } from '../../service/workout'

export class Workout extends Realm.Object<WorkoutType> {
    static schema: Realm.ObjectSchema = {
        name: 'Workout',
        properties: {
            id: 'string',
            name: 'string',
            reps: 'int',
            set: 'int',
            totalSets: 'int',
            notes: 'string',
            completed: 'bool',
            user: 'string',
            created: 'string',
            updated: 'string'
        },
        primaryKey: 'id'
    }

    static createWorkout(params: WorkoutType, realm: Realm) {
        realm.write(() => {
            realm.create<WorkoutType>('Workout', {
                ...params,
                completed: false
            })
        })
    }

    static getWorkouts(realm: Realm) {
        return realm.objects<WorkoutType>('Workout').sorted('created', true)
    }

    static getWorkout(id: string, realm: Realm) {
        return realm.objectForPrimaryKey<WorkoutType>('Workout', id)
    }

    static updateWorkout(
        id: string,
        params: Partial<WorkoutType>,
        realm: Realm
    ) {
        realm.write(() => {
            realm.create<WorkoutType>(
                'Workout',
                { ...params, id },
                UpdateMode.Modified
            )
        })
    }

    static deleteWorkout(id: string, realm: Realm) {
        realm.write(() => {
            const workout = realm.objectForPrimaryKey<WorkoutType>(
                'Workout',
                id
            )
            realm.delete(workout)
        })
    }

    static incrementWorkoutSet(id: string, realm: Realm) {
        realm.write(() => {
            realm.create<WorkoutType>(
                'Workout',
                { id, set: this.getWorkout(id, realm)?.set || 0 + 1 },
                UpdateMode.Modified
            )
        })
    }

    static decrementWorkoutSet(id: string, realm: Realm) {
        realm.write(() => {
            realm.create<WorkoutType>(
                'Workout',
                { id, set: this.getWorkout(id, realm)?.set || 0 - 1 },
                UpdateMode.Modified
            )
        })
    }
}
