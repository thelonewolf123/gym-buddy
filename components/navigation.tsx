import { router } from 'expo-router'
import { Box, Center, HStack, Icon, Pressable, Text } from 'native-base'
import React, { useState } from 'react'

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

export const Navigation: React.FC<{ children: React.ReactElement }> = ({
    children
}) => {
    const [selected, setSelected] = useState(0)

    return (
        <Box flex={1} bg="white" safeAreaTop width="100%" alignSelf="center">
            {children}
            <HStack
                bg="indigo.600"
                alignItems="center"
                safeAreaBottom
                shadow={6}
            >
                <Pressable
                    opacity={selected === 0 ? 1 : 0.5}
                    py="3"
                    flex={1}
                    onPress={() => {
                        setSelected(0)
                        router.push('/')
                    }}
                >
                    <Center>
                        <Icon
                            mb="1"
                            as={
                                <MaterialCommunityIcons
                                    name={
                                        selected === 0 ? 'home' : 'home-outline'
                                    }
                                />
                            }
                            color="white"
                            size="sm"
                        />
                        <Text fontSize="12">Home</Text>
                    </Center>
                </Pressable>
                <Pressable
                    opacity={selected === 1 ? 1 : 0.5}
                    py="2"
                    flex={1}
                    onPress={() => {
                        setSelected(1)
                        router.push('/history')
                    }}
                >
                    <Center>
                        <Icon
                            mb="1"
                            as={<MaterialIcons name="history" />}
                            color="white"
                            size="sm"
                        />
                        <Text fontSize="12">History</Text>
                    </Center>
                </Pressable>
                <Pressable
                    opacity={selected === 2 ? 1 : 0.6}
                    py="2"
                    flex={1}
                    onPress={() => {
                        setSelected(2)
                        router.push('/account')
                    }}
                >
                    <Center>
                        <Icon
                            mb="1"
                            as={<MaterialCommunityIcons name={'account'} />}
                            color="white"
                            size="sm"
                        />
                        <Text fontSize="12">Account</Text>
                    </Center>
                </Pressable>
            </HStack>
        </Box>
    )
}
