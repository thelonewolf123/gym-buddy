import { Box, Card, Heading, HStack, Progress, Text, View } from 'native-base'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TouchableOpacity } from 'react-native'

import { WorkoutType } from '../service/workout'

function InfoCard({
    title,
    children,
    width,
    color,
    align = 'center'
}: {
    title: string
    children: React.ReactNode
    width: 'full' | '1/2'
    color: 'bg-blue-400' | 'bg-red-400' | 'bg-purple-400'
    align?: 'center' | 'left' | 'right'
}) {
    return (
        <TouchableOpacity
            className={`p-4 ${color} rounded shadow-xl`}
            style={{
                width: width === 'full' ? '100%' : '48%'
            }}
        >
            <View>
                <Heading
                    mb="2"
                    size={'md'}
                    fontWeight={'semibold'}
                    textAlign={align}
                >
                    {title}
                </Heading>
                {children}
            </View>
        </TouchableOpacity>
    )
}

export const Analytics: React.FC<{ workout: WorkoutType }> = ({ workout }) => {
    const getDuration = useCallback(() => {
        if (!workout.startedAt) return 0
        const start = new Date(workout.startedAt).getTime()
        const end = workout.completed
            ? new Date(workout.updated).getTime()
            : new Date().getTime()
        const diff = end - start
        return Math.floor(diff / 1000)
    }, [workout.created, workout.updated, workout.completed])

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

    useEffect(() => {
        if (workout.completed) return clearInterval(intervalRef.current)

        intervalRef.current = setInterval(() => {
            setDuration(getDuration())
        }, 1000)

        return () => {
            clearInterval(intervalRef.current)
        }
    }, [workout.completed])

    return (
        <Box p="4" mt="4" className="flex flex-col gap-2">
            <Heading mb="2">Info</Heading>
            <View>
                <View className="w-full mt-2">
                    <InfoCard
                        title="Duration"
                        width="full"
                        align="left"
                        color="bg-red-400"
                    >
                        <Text className="text-2xl font-bold text-center">
                            {formattedDuration}
                        </Text>
                    </InfoCard>
                </View>
                <View className="w-full mt-2">
                    <InfoCard
                        title="Progress"
                        width="full"
                        align="left"
                        color="bg-blue-400"
                    >
                        <Progress
                            value={workout.set}
                            max={workout.totalSets}
                            colorScheme="rose"
                        />
                    </InfoCard>
                </View>
                <HStack
                    style={{
                        width: '100%',
                        justifyContent: 'space-between',
                        display: 'flex',
                        marginTop: 10
                    }}
                >
                    <InfoCard
                        title="Total sets"
                        width="1/2"
                        color="bg-purple-400"
                    >
                        <Text className="text-2xl font-bold text-center">
                            {workout.totalSets}
                        </Text>
                    </InfoCard>
                    <InfoCard
                        title="Reps per set"
                        width="1/2"
                        color="bg-purple-400"
                    >
                        <Text className="text-2xl font-bold text-center">
                            {workout.reps}
                        </Text>
                    </InfoCard>
                </HStack>
            </View>
        </Box>
    )
}
