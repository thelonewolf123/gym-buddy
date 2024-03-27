import { UpdateMode } from 'realm'

import { Realm } from '@realm/react'

import { WorkoutInput, WorkoutType } from '../../service/workout'
import { uniqueId } from '../../utils'

export class Workout extends Realm.Object<WorkoutType> {
    id!: string
    name!: string
    reps!: number
    set!: number
    totalSets!: number
    notes!: string
    completed!: boolean
    user!: string
    created!: Date
    updated!: Date
    sync?: boolean
    deleted?: boolean
    startedAt?: Date

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
            startedAt: 'date?',
            created: { type: 'date', default: new Date() },
            updated: { type: 'date', default: new Date() },
            sync: { type: 'bool', default: false },
            deleted: { type: 'bool', default: false }
        },
        primaryKey: 'id'
    }

    static createWorkout(
        params: WorkoutInput | WorkoutType,
        userId: string,
        realm: Realm
    ) {
        const id = uniqueId()
        realm.write(() => {
            realm.create<WorkoutType>('Workout', {
                created: new Date(),
                updated: new Date(),
                user: userId,
                id,
                sync: false,
                completed: false,
                ...params
            })
        })

        return realm.objectForPrimaryKey<WorkoutType>('Workout', id)
    }

    static getWorkouts(realm: Realm, userId: string): WorkoutType[] {
        return realm
            .objects<WorkoutType>('Workout')
            .sorted('created', true)
            .filtered(`user = "${userId}"`)
            .filtered('deleted != true')
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
                { ...params, id, updated: new Date() },
                UpdateMode.Modified
            )
        })
    }

    static deleteWorkout(id: string, realm: Realm) {
        this.updateWorkout(id, { deleted: true }, realm)
    }

    static incrementWorkoutSet(id: string, realm: Realm) {
        realm.write(() => {
            const workout = this.getWorkout(id, realm)
            if (!workout) return
            realm.create<WorkoutType>(
                'Workout',
                { id, set: workout.set + 1, updated: new Date() },
                UpdateMode.Modified
            )
        })
    }

    static decrementWorkoutSet(id: string, realm: Realm) {
        realm.write(() => {
            const workout = this.getWorkout(id, realm)
            if (!workout) return
            realm.create<WorkoutType>(
                'Workout',
                { id, set: workout.set - 1, updated: new Date() },
                UpdateMode.Modified
            )
        })
    }
}
