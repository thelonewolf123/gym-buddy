import { router } from 'expo-router'
import {
    Actionsheet,
    Box,
    Button,
    Center,
    Fab,
    FormControl,
    Input,
    ScrollView,
    Text,
    useDisclose
} from 'native-base'
import React, { useCallback, useEffect, useState } from 'react'
import { ToastAndroid } from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import useAuth from '../hooks/useAuth'
import { useGetWorkoutById } from '../hooks/useGetWorkoutById'
import useWorkout from '../hooks/useWorkout'
import { WorkoutInput } from '../service/workout'

export default function WorkoutForm({
    id,
    isOpen: isOpenProp,
    onClose: onCloseEvent
}: {
    id?: string
    isOpen?: boolean
    onClose?: () => void
}) {
    const { user } = useAuth()
    const { isOpen, onOpen, onClose } = useDisclose()
    const workoutInfo = useGetWorkoutById(id)

    const [workout, setWorkout] = useState<WorkoutInput>(() => {
        if (workoutInfo) {
            return {
                name: workoutInfo.name,
                reps: workoutInfo.reps,
                set: workoutInfo.set,
                totalSets: workoutInfo.totalSets,
                notes: workoutInfo.notes
            }
        }

        return {
            name: '',
            reps: 0,
            set: 0,
            totalSets: 0,
            notes: ''
        }
    })

    const { createWorkout, updateWorkout } = useWorkout()

    const handleChange = (name: keyof WorkoutInput, value: string | number) => {
        setWorkout((prevWorkout) => ({
            ...prevWorkout,
            [name]: value
        }))
    }

    useEffect(() => {
        if (isOpenProp) {
            onOpen()
        }
    }, [isOpenProp])

    const handleSubmit = useCallback(() => {
        // Do something with the workout data
        if (!user) {
            return
        }

        if (workoutInfo) {
            updateWorkout(workoutInfo.id, workout)
            ToastAndroid.show('Workout updated', ToastAndroid.SHORT)
            onClose()
            onCloseEvent?.()
            return
        }

        if (!workout.name || !workout.reps || !workout.totalSets) {
            ToastAndroid.show('Please fill out all fields', ToastAndroid.SHORT)
        } else {
            const result = createWorkout(workout, user.id)
            if (!result) return console.error('Failed to create workout')
            router.push(`/workout/${result.id}`)
        }
    }, [createWorkout, user, workout])

    return (
        <>
            {isOpenProp ? null : (
                <Fab
                    renderInPortal={false}
                    shadow={2}
                    size="sm"
                    backgroundColor={'purple.800'}
                    icon={
                        id ? (
                            <MaterialCommunityIcons
                                name="pencil"
                                color={'white'}
                                size={24}
                            />
                        ) : (
                            <MaterialCommunityIcons
                                name="plus"
                                color={'white'}
                                size={24}
                            />
                        )
                    }
                    onPress={onOpen}
                />
            )}

            <Actionsheet
                isOpen={isOpen}
                onClose={() => {
                    onClose()
                    onCloseEvent?.()
                }}
            >
                <Actionsheet.Content w="100%" backgroundColor={'purple.400'}>
                    <ScrollView w="100%" m="1">
                        <Center>
                            <Box w="90%" mt="4">
                                <FormControl>
                                    <Text className="py-2 font-semibold text-white">
                                        Workout Name
                                    </Text>
                                    <Input
                                        placeholder="Name"
                                        value={workout.name}
                                        borderColor="gray.200"
                                        color={'white'}
                                        placeholderTextColor={'gray.100'}
                                        onChangeText={(value) =>
                                            handleChange('name', value)
                                        }
                                    />
                                </FormControl>
                                <FormControl>
                                    <Text className="py-2 font-semibold text-white">
                                        Reps
                                    </Text>
                                    <Input
                                        placeholder="Reps"
                                        value={workout.reps.toString()}
                                        borderColor="gray.200"
                                        color={'white'}
                                        onChangeText={(value) =>
                                            handleChange(
                                                'reps',
                                                parseInt(value) || 0
                                            )
                                        }
                                        keyboardType="numeric"
                                    />
                                </FormControl>
                                <FormControl>
                                    <Text className="py-2 font-semibold text-white">
                                        Total Sets
                                    </Text>
                                    <Input
                                        placeholder="Total Sets"
                                        value={workout.totalSets.toString()}
                                        borderColor="gray.200"
                                        color={'white'}
                                        onChangeText={(value) =>
                                            handleChange(
                                                'totalSets',
                                                parseInt(value) || 0
                                            )
                                        }
                                        keyboardType="numeric"
                                    />
                                </FormControl>
                                <FormControl mt="2" mb="4">
                                    <Button
                                        onPress={handleSubmit}
                                        backgroundColor={'purple.500'}
                                    >
                                        Submit
                                    </Button>
                                </FormControl>
                            </Box>
                        </Center>
                    </ScrollView>
                </Actionsheet.Content>
            </Actionsheet>
        </>
    )
}
