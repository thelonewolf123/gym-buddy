import { router, Stack } from 'expo-router'
import { capitalize } from 'lodash'
import {
    Center,
    Heading,
    HStack,
    List,
    ScrollView,
    Text,
    View,
    VStack
} from 'native-base'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import { DatePicker } from '../components/date-picker'
import { WorkoutAction } from '../components/workout-action'
import WorkoutForm from '../components/workout-form'
import { useWorkoutStore } from '../hooks/useWorkout'
import { useWorkoutList } from '../hooks/useWorkoutList'

export default function Index() {
    const date = useWorkoutStore((s) => s.dateFilter)
    const workoutList = useWorkoutList(date)

    const [activeWorkoutId, setActiveWorkoutId] = useState<string>()

    const formatName = (name: string) => {
        name = capitalize(name).slice(0, 15)
        if (name.length < 15) {
            return name
        }
        name = name.trim()
        return name + '...'
    }

    return (
        <>
            <DatePicker />
            <Stack.Screen
                options={{
                    headerTitle: 'GYM Buddy'
                }}
            ></Stack.Screen>
            <WorkoutForm />
            {typeof activeWorkoutId === 'string' ? (
                <WorkoutAction
                    id={activeWorkoutId}
                    onClose={() => setActiveWorkoutId(undefined)}
                />
            ) : null}

            {workoutList.length === 0 ? (
                <Center h="100%">
                    <Heading>No workouts</Heading>
                </Center>
            ) : (
                <ScrollView w="100%" borderWidth={0}>
                    <List>
                        {workoutList.map((workout) => (
                            <List.Item
                                w="100%"
                                key={workout.id}
                                mb="1"
                                rounded={'lg'}
                                onPress={() => {
                                    router.push(`/workout/${workout.id}`)
                                }}
                                onLongPress={() =>
                                    setActiveWorkoutId(workout.id)
                                }
                            >
                                <HStack
                                    mr="2"
                                    p="2"
                                    borderColor={'black'}
                                    borderWidth={'2'}
                                    rounded={'lg'}
                                >
                                    <FontAwesomeIcon
                                        name="dumbbell"
                                        size={34}
                                        color={'#111'}
                                    />
                                </HStack>

                                <HStack
                                    w="80%"
                                    className="flex justify-between"
                                >
                                    <VStack className="flex flex-col gap-1">
                                        <Heading>
                                            {formatName(workout.name)}
                                        </Heading>
                                        <Text color={'secondary'}>
                                            {workout.reps} reps, {workout.set}{' '}
                                            sets
                                        </Text>
                                    </VStack>
                                    <Center>
                                        {workout.created ? (
                                            <Text color={'secondary'}>
                                                {new Date(
                                                    workout.created
                                                ).toLocaleDateString()}
                                            </Text>
                                        ) : null}
                                    </Center>
                                </HStack>
                            </List.Item>
                        ))}
                    </List>
                </ScrollView>
            )}
        </>
    )
}
