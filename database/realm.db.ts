import { createRealmContext } from '@realm/react'

import { Workout } from './schema/workout.schema'

export const WorkoutRealmContext = createRealmContext({
    schema: [Workout],
    schemaVersion: 2,
    migrationOptions: {
        resolveEmbeddedConstraints: true
    },
    onMigration: (oldRealm, newRealm) => {
        if (oldRealm.schemaVersion < 1) {
            const oldObjects = oldRealm.objects('Workout')
            const newObjects = newRealm.objects('Workout')

            for (let i = 0; i < oldObjects.length; i++) {
                newObjects[i].temp = false
            }
        } else if (oldRealm.schemaVersion < 2) {
            const oldObjects = oldRealm.objects('Workout')
            const newObjects = newRealm.objects('Workout')

            for (let i = 0; i < oldObjects.length; i++) {
                newObjects[i].deleted = false
            }
        }
    }
})
