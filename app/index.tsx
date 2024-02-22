import { Redirect, router, Stack, usePathname } from 'expo-router'
import { capitalize } from 'lodash'
import {
    Center,
    Fab,
    Heading,
    HStack,
    List,
    ScrollView,
    Spinner,
    Text,
    VStack
} from 'native-base'
import { useEffect, useState } from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import useAuth from '../hooks/useAuth'
import { getWorkouts, WorkoutType } from '../service/workout'

export default function Index() {
    const [workoutList, setWorkoutList] = useState<WorkoutType[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const pathname = usePathname()

    useEffect(() => {
        if (!user) return

        getWorkouts().then((workouts) => {
            setWorkoutList(workouts.items)
            setLoading(false)
        })
    }, [pathname, user])

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
            <Stack.Screen
                options={{
                    headerTitle: 'Home'
                }}
            ></Stack.Screen>
            <Fab
                renderInPortal={false}
                shadow={2}
                size="sm"
                icon={<MaterialCommunityIcons name="plus" color={'white'} />}
                onPress={() => router.replace('/new')}
            />
            <ScrollView w="100%">
                {loading ? (
                    <Center h={'100%'} w="100%">
                        <Spinner size={'lg'} />
                    </Center>
                ) : (
                    <List>
                        {workoutList.map((workout) => (
                            <List.Item
                                key={workout.id}
                                w="100%"
                                onPress={() => {
                                    router.push(`/workout/${workout.id}`)
                                }}
                            >
                                <HStack pr="4">
                                    <MaterialCommunityIcons
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
                                        <Text
                                            color={'coolGray.400'}
                                            _dark={{
                                                color: 'warmGray.400'
                                            }}
                                        >
                                            {workout.reps} reps, {workout.set}{' '}
                                            sets
                                        </Text>
                                    </VStack>
                                    <Center>
                                        {workout.created ? (
                                            <Text
                                                color={'coolGray.400'}
                                                _dark={{
                                                    color: 'warmGray.400'
                                                }}
                                            >
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
                )}
            </ScrollView>
        </>
    )
}
