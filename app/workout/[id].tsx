import { useLocalSearchParams, useRouter } from 'expo-router'
import { Spinner, View } from 'native-base'
import { useEffect, useState } from 'react'

import { Counter } from '../../components/counter'
import { getWorkout, Workout } from '../../service/workout'

export default function WorkoutId() {
    const [workout, setWorkout] = useState<Workout | null>(null)
    const params = useLocalSearchParams()

    useEffect(() => {
        const id = params.id
        if (typeof id !== 'string') return
        getWorkout(id).then((workout) => {
            setWorkout(workout)
        })
    }, [])

    return <View>{workout ? <Counter workout={workout} /> : <Spinner />}</View>
}
