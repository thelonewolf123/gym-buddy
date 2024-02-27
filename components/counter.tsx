import { capitalize } from 'lodash'
import { Button, Center, Heading, HStack, Text } from 'native-base'
import React, { useState } from 'react'
import { View } from 'react-native'

import useWorkout from '../hooks/useWorkout'
import { WorkoutType } from '../service/workout'

export const Counter: React.FC<{
    workout: WorkoutType
}> = ({ workout }) => {
    const sets = workout.set
    const completed = workout.completed

    const { incrementWorkoutSet, decrementWorkoutSet, markWorkoutAsComplete } =
        useWorkout()

    const incrementSets = () => {
        incrementWorkoutSet(workout.id)
    }

    const decrementSets = () => {
        if (sets <= 0) return
        decrementWorkoutSet(workout.id)
    }

    const markComplete = () => {
        markWorkoutAsComplete(workout.id)
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
                    >
                        <HStack>
                            <Text className="text-white">Increment (+)</Text>
                        </HStack>
                    </Button>
                    <Button
                        colorScheme={'red'}
                        onPress={decrementSets}
                        isDisabled={sets <= 0 || completed}
                    >
                        <HStack>
                            <Text className="text-white">Decrement (-)</Text>
                        </HStack>
                    </Button>

                    {sets >= workout.totalSets && !completed && (
                        <Button colorScheme={'green'} onPress={markComplete}>
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
