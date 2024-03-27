import { useMemo } from 'react'

import { WorkoutRealmContext } from '../database/realm.db'
import { Workout } from '../database/schema/workout.schema'
import { useWorkoutStore } from './useWorkout'

export function useWorkoutList(date?: Date) {
    const { user } = useWorkoutStore()

    const { useQuery } = useMemo(() => WorkoutRealmContext, [])
    const workoutList = useQuery(
        Workout,
        (realm) => {
            if (!user) return realm.filtered('id = ""') // return empty realm
            const data = realm
                .sorted('created', true)
                .filtered(`user = "${user.id}"`)
                .filtered('deleted != true')

            if (date) {
                const startDate = new Date(date)
                const endDate = new Date(date)

                startDate.setHours(0, 0, 0, 0)
                endDate.setHours(23, 59, 59, 999)
                return data.filtered(
                    `created >= $0 && created <= $1`,
                    startDate,
                    endDate
                )
            }

            return data
        },
        [user, date]
    )

    return workoutList.map((workout) => workout)
}
