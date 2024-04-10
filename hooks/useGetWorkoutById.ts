import { useMemo } from 'react'

import { WorkoutRealmContext } from '../database/realm.db'
import { Workout } from '../database/schema/workout.schema'
import { useWorkoutStore } from './useWorkout'

export function useGetWorkoutById(id?: string) {
    const { useQuery } = useMemo(() => WorkoutRealmContext, [])
    const workoutList = useQuery(
        Workout,
        (realm) => {
            return realm
                .sorted('created', true)
                .filtered(`id = "${id}"`)
                .filtered('deleted != true')
        },
        [id]
    )

    if (!id) return null

    return workoutList.map((workout) => workout).at(0)
}
