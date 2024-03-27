import { Redirect, router, Stack } from 'expo-router'
import { capitalize } from 'lodash'
import {
    Center,
    Heading,
    HStack,
    List,
    ScrollView,
    Text,
    VStack
} from 'native-base'
import React, { useState } from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import { DatePicker } from '../components/date-picker'
import { WorkoutAction } from '../components/workout-action'
import WorkoutForm from '../components/workout-form'
import useAuth from '../hooks/useAuth'
import { useWorkoutStore } from '../hooks/useWorkout'
import { useWorkoutList } from '../hooks/useWorkoutList'

export default function Index() {
    const date = useWorkoutStore((s) => s.dateFilter)
    const workoutList = useWorkoutList(date)

    const { user } = useAuth()
    const [activeWorkoutId, setActiveWorkoutId] = useState<string>()

    if (!user) {
        return <Redirect href={'/login'} />
    }

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
            <ScrollView w="100%">
                <List>
                    {workoutList.map((workout) => (
                        <List.Item
                            key={workout.id}
                            w="100%"
                            onPress={() => {
                                router.push(`/workout/${workout.id}`)
                            }}
                            onLongPress={() => setActiveWorkoutId(workout.id)}
                        >
                            <HStack pr="4">
                                <MaterialCommunityIcons
                                    name="dumbbell"
                                    size={34}
                                    color={'#111'}
                                />
                            </HStack>
                            <HStack w="80%" className="flex justify-between">
                                <VStack className="flex flex-col gap-1">
                                    <Heading>
                                        {formatName(workout.name)}
                                    </Heading>
                                    <Text color={'secondary'}>
                                        {workout.reps} reps, {workout.set} sets
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
        </>
    )
}
