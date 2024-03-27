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
    const startedAt = workout.startedAt

    const {
        incrementWorkoutSet,
        decrementWorkoutSet,
        markWorkoutAsComplete,
        startWorkout
    } = useWorkout()

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
                    {startedAt ? null : (
                        <Button
                            colorScheme={'blue'}
                            onPress={() => startWorkout(workout.id)}
                            size={'lg'}
                        >
                            <HStack>
                                <Text className="px-4 text-white">
                                    Start Workout
                                </Text>
                            </HStack>
                        </Button>
                    )}
                    {startedAt ? (
                        <Button
                            colorScheme={'red'}
                            onPress={decrementSets}
                            isDisabled={sets <= 0 || completed}
                            size={'lg'}
                        >
                            <HStack>
                                <Text className="px-4 text-white">
                                    Decrement (-)
                                </Text>
                            </HStack>
                        </Button>
                    ) : null}
                    {startedAt && !completed && sets < workout.totalSets ? (
                        <Button
                            colorScheme={'blue'}
                            onPress={incrementSets}
                            isDisabled={sets >= workout.totalSets || completed}
                            size={'lg'}
                        >
                            <HStack>
                                <Text className="px-4 text-white">
                                    Increment (+)
                                </Text>
                            </HStack>
                        </Button>
                    ) : null}

                    {sets >= workout.totalSets && (
                        <Button
                            colorScheme={'green'}
                            onPress={markComplete}
                            isDisabled={completed}
                            size={'lg'}
                        >
                            <HStack>
                                <Text className="px-4 text-white">
                                    Complete
                                </Text>
                            </HStack>
                        </Button>
                    )}
                </View>
            </View>
        </Center>
    )
}
