import { Button, Container, Text } from 'native-base'
import React, { useState } from 'react'
import { View } from 'react-native'

export function Counter() {
    const [sets, setSets] = useState(0)

    const incrementSets = () => {
        setSets(sets + 1)
    }

    const decrementSets = () => {
        if (sets > 0) {
            setSets(sets - 1)
        }
    }

    return (
        <Container className="flex items-center justify-center">
            <Text className="pb-4 text-4xl">Gym Set Counter</Text>
            <View className="flex flex-col items-center">
                <Text className="flex px-4 py-2 text-4xl">{sets}</Text>
                <View className="flex flex-col w-full gap-2">
                    <Button
                        className="px-4 text-3xl w-fit"
                        colorScheme={'blue'}
                        onPress={incrementSets}
                    >
                        <Text className="text-3xl text-white">
                            Increment (+)
                        </Text>
                    </Button>
                    <Button
                        className="px-4 text-3xl w-fit"
                        colorScheme={'red'}
                        onPress={decrementSets}
                    >
                        <Text className="text-3xl text-white">
                            Decrement (-)
                        </Text>
                    </Button>
                </View>
            </View>
        </Container>
    )
}
