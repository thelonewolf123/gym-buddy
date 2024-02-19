import { capitalize } from 'lodash'
import {
    Button,
    Center,
    Container,
    Heading,
    HStack,
    Spinner,
    Text
} from 'native-base'
import React, { useState } from 'react'
import { View } from 'react-native'

import {
    decrementWorkoutSet,
    incrementWorkoutSet,
    Workout
} from '../service/workout'

export const Counter: React.FC<{ workout: Workout }> = ({ workout }) => {
    const [sets, setSets] = useState(workout.set)
    const [loadingAdd, setLoadingAdd] = useState(false)
    const [loadingSub, setLoadingSub] = useState(false)

    const incrementSets = () => {
        if (loadingAdd || loadingSub) return
        setLoadingAdd(true)
        incrementWorkoutSet(workout.id).then(() => {
            setSets((s) => s + 1)
            setLoadingAdd(false)
        })
    }

    const decrementSets = () => {
        if (sets <= 0 || loadingSub) return
        setLoadingSub(true)
        decrementWorkoutSet(workout.id).then(() => {
            setSets((s) => s - 1)
            setLoadingSub(false)
        })
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
                        isDisabled={sets >= workout.totalSets}
                        isLoading={loadingAdd}
                    >
                        <HStack>
                            <Text className="text-white">Increment (+)</Text>
                        </HStack>
                    </Button>
                    <Button
                        colorScheme={'red'}
                        onPress={decrementSets}
                        isDisabled={sets <= 0}
                        isLoading={loadingSub}
                    >
                        <HStack>
                            <Text className="text-white">Decrement (-)</Text>
                        </HStack>
                    </Button>
                </View>
            </View>
        </Center>
    )
}
