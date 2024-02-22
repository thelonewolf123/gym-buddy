import { Box, Center, Heading, Text, View } from 'native-base'
import { useMemo, useRef, useState } from 'react'

import { WorkoutType } from '../service/workout'

export const Analytics: React.FC<{ workout: WorkoutType }> = ({ workout }) => {
    const getDuration = () => {
        const start = new Date(workout.created).getTime()
        const end = workout.completed
            ? new Date(workout.updated).getTime()
            : new Date().getTime()
        const diff = end - start
        return Math.floor(diff / 1000)
    }

    const [duration, setDuration] = useState(getDuration)
    const intervalRef = useRef<NodeJS.Timeout>()

    const formattedDuration = useMemo(() => {
        const minutes = Math.floor(duration / 60)
        const seconds = duration % 60

        if (seconds < 10 && minutes < 10) {
            return `0${minutes}:0${seconds}`
        }

        if (seconds < 10) {
            return `${minutes}:0${seconds}`
        }

        if (minutes < 10) {
            return `0${minutes}:${seconds}`
        }

        return `${minutes}:${seconds}`
    }, [duration])

    useMemo(() => {
        if (workout.completed) return clearInterval(intervalRef.current)

        intervalRef.current = setInterval(() => {
            setDuration(getDuration())
        }, 1000)

        return () => {
            clearInterval(intervalRef.current)
        }
    }, [workout.completed])

    return (
        <Box p="4" mt="4">
            <Heading mb="2">Analytics</Heading>
            <Text fontSize={'lg'}>
                Duration of workout:{' '}
                <Text fontSize={'xl'} fontWeight={'semibold'}>
                    {formattedDuration}
                </Text>{' '}
                minutes
            </Text>
            <Text fontSize={'lg'}>
                Total sets:{' '}
                <Text fontSize={'xl'} fontWeight={'semibold'}>
                    {' '}
                    {workout.totalSets}
                </Text>
            </Text>
        </Box>
    )
}
