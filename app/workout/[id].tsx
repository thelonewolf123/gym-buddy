import { router, Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { Fab, Spinner, View } from 'native-base'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import { Analytics } from '../../components/analytics'
import { Counter } from '../../components/counter'
import { deleteWorkout, getWorkout, WorkoutType } from '../../service/workout'

export default function WorkoutId() {
    const [workout, setWorkout] = useState<WorkoutType | null>(null)

    const params = useLocalSearchParams()
    const id = useMemo(() => {
        if (typeof params.id === 'string') return params.id
        throw new Error('Invalid workout id')
    }, [params.id])

    const refresh = useCallback(() => {
        getWorkout(id).then((workout) => {
            setWorkout(workout)
        })
    }, [id])

    useEffect(() => {
        refresh()
    }, [refresh])

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Workout Details'
                }}
            ></Stack.Screen>
            <Fab
                renderInPortal={false}
                shadow={2}
                size="sm"
                backgroundColor={'red.500'}
                icon={
                    <MaterialCommunityIcons name="trash-can" color={'white'} />
                }
                onPress={() =>
                    deleteWorkout(id).then(() => {
                        router.replace('/')
                    })
                }
            />
            <View>
                {workout ? (
                    <>
                        <Counter workout={workout} refresh={refresh} />
                        <Analytics workout={workout} />
                    </>
                ) : (
                    <Spinner />
                )}
            </View>
        </>
    )
}
