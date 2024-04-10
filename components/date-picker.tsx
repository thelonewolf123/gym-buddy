import { capitalize } from 'lodash'
import { HStack, Text } from 'native-base'
import { useState } from 'react'
import { StyleSheet, TouchableNativeFeedback, View } from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import DateTimePicker, {
    DateTimePickerEvent
} from '@react-native-community/datetimepicker'

import { useWorkoutStore } from '../hooks/useWorkout'

export function DatePicker() {
    const date = useWorkoutStore((s) => s.dateFilter)
    const setDate = useWorkoutStore((s) => s.setDateFilter)

    const [show, setShow] = useState(false)

    function onChange(event: DateTimePickerEvent, selectedDate?: Date) {
        if (event.type === 'dismissed') {
            setShow(false)
        }

        if (selectedDate) {
            setShow(false)
            setDate(selectedDate)
        }
    }
    const formattedDate = `${date.getDate()} ${capitalize(
        date.toLocaleString('default', { month: 'short' })
    )} ${date.getFullYear()}`

    const changeDate = (action: 'next' | 'previous') => {
        const TWENTY_FOUR_HOURS = 60 * 60 * 24 * 1000
        if (action === 'next') {
            setDate(new Date(date.getTime() + TWENTY_FOUR_HOURS))
        } else {
            setDate(new Date(date.getTime() - TWENTY_FOUR_HOURS))
        }
    }

    return (
        <View className="flex flex-row items-center justify-center w-full gap-4 py-2 align-baseline">
            <MaterialCommunityIcons
                name="arrow-left-bold-circle"
                color={'red'}
                size={28}
                onPress={() => changeDate('previous')}
            />
            <View className="flex flex-row items-center justify-center py-2 align-baseline">
                <Text
                    className="px-2"
                    fontWeight={'semibold'}
                    fontSize={'xl'}
                    onPress={() => setShow((v) => !v)}
                >
                    {formattedDate}
                </Text>
                <MaterialCommunityIcons name="calendar" size={24} />
                {show ? (
                    <DateTimePicker value={date} onChange={onChange} />
                ) : null}
            </View>
            <MaterialCommunityIcons
                name="arrow-right-bold-circle"
                size={28}
                color={'green'}
                onPress={() => changeDate('next')}
            />
        </View>
    )
}
