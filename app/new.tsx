import { router } from 'expo-router'
import {
    Box,
    Button,
    Center,
    FormControl,
    Heading,
    Input,
    ScrollView,
    Spinner,
    Text,
    TextArea
} from 'native-base'
import React, { useState } from 'react'
import { TextInput, View } from 'react-native'

import useAuth from '../hooks/useAuth'
import { createWorkout } from '../service/workout'

type Workout = {
    userId: string
    name: string
    date?: Date
    reps: number
    set: number
    totalSets: number
    notes: string
}

export default function New() {
    const { user } = useAuth()

    const [workout, setWorkout] = useState<Workout>({
        userId: '',
        name: '',
        reps: 0,
        set: 0,
        totalSets: 0,
        notes: ''
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (name: keyof Workout, value: string | number) => {
        setWorkout((prevWorkout) => ({
            ...prevWorkout,
            [name]: value
        }))
    }

    const handleSubmit = () => {
        // Do something with the workout data
        console.log(workout)
        setLoading(true)
        workout.userId = user?.id || ''
        createWorkout(workout)
            .then((result) => {
                setLoading(false)
                router.replace(`/workout/${result.id}`)
            })
            .catch((err) => {
                console.error(err.originalError)
                setLoading(false)
            })
    }

    return (
        <ScrollView>
            <Center>
                <Box w="90%" mt="4">
                    <Heading size="lg">New Workout</Heading>

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
                                handleChange('totalSets', parseInt(value))
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
    )
}
