import { useMemo } from 'react'

import { WorkoutRealmContext } from '../database/realm.db'
import { Workout } from '../database/schema/workout.schema'
import { useWorkoutStore } from './useWorkout'

export function useWorkoutList() {
    const { user } = useWorkoutStore()

    const { useQuery } = useMemo(() => WorkoutRealmContext, [])
    const workoutList = useQuery(
        Workout,
        (realm) => {
            if (!user) return realm.filtered('id = ""') // return empty realm
            return realm
                .sorted('created', true)
                .filtered(`user = "${user.id}"`)
                .filtered('deleted != true')
        },
        [user]
    )

    return workoutList.map((workout) => workout)
}