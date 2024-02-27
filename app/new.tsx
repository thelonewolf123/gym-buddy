import { router, Stack } from 'expo-router'
import {
    Box,
    Button,
    Center,
    FormControl,
    Input,
    ScrollView,
    TextArea
} from 'native-base'
import React, { useCallback, useState } from 'react'

import useAuth from '../hooks/useAuth'
import useWorkout from '../hooks/useWorkout'
import { WorkoutInput } from '../service/workout'

export default function New() {
    const { user } = useAuth()

    const [workout, setWorkout] = useState<WorkoutInput>({
        name: '',
        reps: 0,
        set: 0,
        totalSets: 0,
        notes: ''
    })
    const [loading, setLoading] = useState(false)
    const { createWorkout } = useWorkout()

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
        setLoading(true)
        const result = createWorkout(workout, user.id)
        if (!result) return console.error('Failed to create workout')
        router.replace(`/workout/${result.id}`)
    }, [createWorkout, user, workout])

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'New Workout'
                }}
            ></Stack.Screen>

            <ScrollView>
                <Center>
                    <Box w="90%" mt="4">
                        <FormControl>
                            <FormControl.Label>Workout Name</FormControl.Label>
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
                                    handleChange('reps', parseInt(value) || 0)
                                }
                                keyboardType="numeric"
                            />
                        </FormControl>

                        <FormControl>
                            <FormControl.Label>Total Sets</FormControl.Label>
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
                            <Button onPress={handleSubmit} isLoading={loading}>
                                Submit
                            </Button>
                        </FormControl>
                    </Box>
                </Center>
            </ScrollView>
        </>
    )
}
