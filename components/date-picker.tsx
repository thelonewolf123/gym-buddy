import { Text } from 'native-base'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

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

    return (
        <View className="flex flex-row items-center justify-center w-full py-2 align-baseline">
            <Text className="px-2">{date.toLocaleDateString()}</Text>
            <MaterialCommunityIcons
                name="calendar"
                size={24}
                onPress={() => setShow((v) => !v)}
            />
            {show ? <DateTimePicker value={date} onChange={onChange} /> : null}
        </View>
    )
}
