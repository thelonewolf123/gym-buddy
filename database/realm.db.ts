import { createRealmContext } from '@realm/react'

import { Workout } from './schema/workout.schema'

export const WorkoutRealmContext = createRealmContext({
    schema: [Workout],
    schemaVersion: 1,
    migrationOptions: {
        resolveEmbeddedConstraints: true
    },
    onMigration: (oldRealm, newRealm) => {
        console.log('Migrating database...')
    }
})
