import { router, Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { Fab, Spinner, View } from 'native-base'
import { useMemo } from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import { Analytics } from '../../components/analytics'
import { Counter } from '../../components/counter'
import WorkoutForm from '../../components/workout-form'
import { useGetWorkoutById } from '../../hooks/useGetWorkoutById'
import useWorkout from '../../hooks/useWorkout'

export default function WorkoutId() {
    const { deleteWorkout } = useWorkout()

    const params = useLocalSearchParams()
    const id = useMemo(() => {
        if (typeof params.id === 'string') return params.id
        throw new Error('Invalid workout id')
    }, [params.id])

    const workout = useGetWorkoutById(id)

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Workout Details'
                }}
            ></Stack.Screen>
            {workout?.completed ? null : <WorkoutForm id={id} />}
            <View>
                {workout ? (
                    <>
                        <Counter workout={workout} />
                        <Analytics workout={workout} />
                    </>
                ) : (
                    <Spinner />
                )}
            </View>
        </>
    )
}
