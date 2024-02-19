import { Button, Spinner, TextArea } from 'native-base'
import React, { useState } from 'react'
import { TextInput, View } from 'react-native'

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
    const [workout, setWorkout] = useState<Workout>({
        userId: '',
        name: '',
        date: undefined,
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
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }

    return (
        <View className={'flex-1'}>
            <TextInput
                placeholder="User ID"
                value={workout.userId}
                onChangeText={(value) => handleChange('userId', value)}
                className={'border border-gray-300 p-2 mb-2'}
            />
            <TextInput
                placeholder="Name"
                value={workout.name}
                onChangeText={(value) => handleChange('name', value)}
                className={'border border-gray-300 p-2 mb-2'}
            />

            <TextInput
                placeholder="Reps"
                value={workout.reps.toString()}
                onChangeText={(value) => handleChange('reps', parseInt(value))}
                className={'border border-gray-300 p-2 mb-2'}
                keyboardType="numeric"
            />
            <TextInput
                placeholder="Set"
                value={workout.set.toString()}
                onChangeText={(value) => handleChange('set', parseInt(value))}
                className={'border border-gray-300 p-2 mb-2'}
                keyboardType="numeric"
            />
            <TextInput
                placeholder="Total Sets"
                value={workout.totalSets.toString()}
                onChangeText={(value) =>
                    handleChange('totalSets', parseInt(value))
                }
                className={'border border-gray-300 p-2 mb-2'}
                keyboardType="numeric"
            />
            <TextArea
                placeholder="Notes"
                value={workout.notes}
                onChangeText={(value) => handleChange('notes', value)}
                style={{ height: 100 }}
                autoCompleteType={'off'}
            />
            <Button onPress={handleSubmit}>
                {loading ? <Spinner /> : 'Submit'}
            </Button>
        </View>
    )
}
