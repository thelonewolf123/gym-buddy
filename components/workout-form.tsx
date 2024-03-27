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
    TextArea,
    useDisclose
} from 'native-base'
import React, { useCallback, useState } from 'react'
import { ToastAndroid } from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import useAuth from '../hooks/useAuth'
import { useGetWorkoutById } from '../hooks/useGetWorkoutById'
import useWorkout from '../hooks/useWorkout'
import { WorkoutInput } from '../service/workout'

export default function WorkoutForm({
    id,
    isOpen: isOpenProp
}: {
    id?: string
    isOpen?: boolean
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

    const handleSubmit = useCallback(() => {
        // Do something with the workout data
        if (!user) {
            return
        }

        if (workoutInfo) {
            updateWorkout(workoutInfo.id, workout)
            ToastAndroid.show('Workout updated', ToastAndroid.SHORT)
            onClose()

            return
        }

        if (!workout.name || !workout.reps || !workout.totalSets) {
            const result = createWorkout(workout, user.id)
            if (!result) return console.error('Failed to create workout')
            router.push(`/workout/${result.id}`)
        } else {
            ToastAndroid.show('Please fill out all fields', ToastAndroid.SHORT)
        }
    }, [createWorkout, user, workout])

    return (
        <>
            {isOpenProp ? null : (
                <Fab
                    renderInPortal={false}
                    shadow={2}
                    size="sm"
                    icon={
                        id ? (
                            <MaterialCommunityIcons
                                name="pencil"
                                color={'white'}
                            />
                        ) : (
                            <MaterialCommunityIcons
                                name="plus"
                                color={'white'}
                            />
                        )
                    }
                    onPress={onOpen}
                />
            )}

            <Actionsheet isOpen={isOpen} onClose={onClose}>
                <Actionsheet.Content w="100%">
                    <ScrollView w="100%" m="1">
                        <Center>
                            <Box w="90%" mt="4">
                                <FormControl>
                                    <FormControl.Label>
                                        Workout Name
                                    </FormControl.Label>
                                    <Input
                                        placeholder="Name"
                                        value={workout.name}
                                        onChangeText={(value) =>
                                            handleChange('name', value)
                                        }
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormControl.Label>Reps</FormControl.Label>
                                    <Input
                                        placeholder="Reps"
                                        value={workout.reps.toString()}
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
                                    <FormControl.Label>
                                        Total Sets
                                    </FormControl.Label>
                                    <Input
                                        placeholder="Total Sets"
                                        value={workout.totalSets.toString()}
                                        onChangeText={(value) =>
                                            handleChange(
                                                'totalSets',
                                                parseInt(value) || 0
                                            )
                                        }
                                        keyboardType="numeric"
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormControl.Label>Notes</FormControl.Label>
                                    <TextArea
                                        placeholder="Notes"
                                        value={workout.notes}
                                        onChangeText={(value) =>
                                            handleChange('notes', value)
                                        }
                                        style={{ height: 100 }}
                                        pt={4}
                                        autoCompleteType={'off'}
                                    />
                                </FormControl>

                                <FormControl mt="2" mb="4">
                                    <Button onPress={handleSubmit}>
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
