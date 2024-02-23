import { capitalize } from 'lodash'
import { Button, Center, Heading, HStack, Text } from 'native-base'
import React, { useState } from 'react'
import { View } from 'react-native'

import useWorkout from '../hooks/useWorkout'
import { WorkoutType } from '../service/workout'

export const Counter: React.FC<{
    workout: WorkoutType
    refresh: () => void
}> = ({ workout, refresh }) => {
    const [sets, setSets] = useState(workout.set)
    const [loadingAdd, setLoadingAdd] = useState(false)
    const [loadingSub, setLoadingSub] = useState(false)
    const [loadingComplete, setLoadingComplete] = useState(false)
    const [completed, setCompleted] = useState(workout.completed)

    const incrementWorkoutSet = useWorkout((s) => s.incrementWorkoutSet)
    const decrementWorkoutSet = useWorkout((s) => s.decrementWorkoutSet)
    const markWorkoutAsComplete = useWorkout((s) => s.markWorkoutAsComplete)

    const incrementSets = () => {
        if (loadingAdd || loadingSub) return
        setLoadingAdd(true)
        incrementWorkoutSet(workout.id)
        setSets((s) => s + 1)
        setLoadingAdd(false)
    }

    const decrementSets = () => {
        if (sets <= 0 || loadingSub) return
        setLoadingSub(true)
        decrementWorkoutSet(workout.id)
        setSets((s) => s - 1)
        setLoadingSub(false)
    }

    const markComplete = () => {
        if (loadingComplete) return
        setLoadingComplete(true)
        markWorkoutAsComplete(workout.id)
        setCompleted(true)
        setLoadingComplete(false)
        refresh()
    }

    return (
        <Center mt="4">
            <Heading>{capitalize(workout.name)}</Heading>
            <View className="flex flex-col items-center">
                <Text className="flex px-4 py-2 text-4xl">{sets}</Text>
                <View className="flex flex-col w-full gap-2">
                    <Button
                        colorScheme={'blue'}
                        onPress={incrementSets}
                        isDisabled={sets >= workout.totalSets || completed}
                        isLoading={loadingAdd}
                    >
                        <HStack>
                            <Text className="text-white">Increment (+)</Text>
                        </HStack>
                    </Button>
                    <Button
                        colorScheme={'red'}
                        onPress={decrementSets}
                        isDisabled={sets <= 0 || completed}
                        isLoading={loadingSub}
                    >
                        <HStack>
                            <Text className="text-white">Decrement (-)</Text>
                        </HStack>
                    </Button>

                    {sets >= workout.totalSets && !completed && (
                        <Button
                            colorScheme={'green'}
                            onPress={markComplete}
                            isLoading={loadingComplete}
                        >
                            <HStack>
                                <Text className="text-white">Complete</Text>
                            </HStack>
                        </Button>
                    )}
                </View>
            </View>
        </Center>
    )
}
