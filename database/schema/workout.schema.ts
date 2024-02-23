import { UpdateMode } from 'realm'

import { Realm } from '@realm/react'

import { WorkoutInput, WorkoutType } from '../../service/workout'
import { uniqueId } from '../../utils'

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
            updated: 'string',
            temp: 'bool?'
        },
        primaryKey: 'id'
    }

    static createWorkout(params: WorkoutInput, userId: string, realm: Realm) {
        const id = uniqueId()
        realm.write(() => {
            realm.create<WorkoutType>('Workout', {
                ...params,
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
                user: userId,
                id,
                temp: true,
                completed: false
            })
        })

        return realm.objectForPrimaryKey<WorkoutType>('Workout', id)
    }

    static getWorkouts(realm: Realm, userId: string): WorkoutType[] {
        return realm
            .objects<WorkoutType>('Workout')
            .sorted('created', true)
            .filtered(`user = "${userId}"`)
            .map((workout) => workout)
    }

    static getWorkout(id: string, realm: Realm): WorkoutType | undefined {
        const obj = realm.objectForPrimaryKey<WorkoutType>('Workout', id)
        if (obj) {
            return obj
        }
    }

    static updateWorkout(
        id: string,
        params: Partial<WorkoutType>,
        realm: Realm
    ) {
        realm.write(() => {
            realm.create<WorkoutType>(
                'Workout',
                { ...params, id, updated: new Date().toISOString() },
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
