import { createRealmContext } from '@realm/react'

import { Workout } from './schema/workout.schema'

export const WorkoutRealmContext = createRealmContext({
    schema: [Workout]
})
