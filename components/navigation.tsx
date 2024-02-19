import { router, usePathname } from 'expo-router'
import { Box, Center, HStack, Icon, Pressable, Text } from 'native-base'
import React, { useState } from 'react'

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

export const Navigation: React.FC<{ children: React.ReactElement }> = ({
    children
}) => {
    const pathname = usePathname()

    if (pathname === '/signup' || pathname === '/login') {
        return children
    }

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
                    opacity={pathname === '/' ? 1 : 0.5}
                    py="3"
                    flex={1}
                    onPress={() => {
                        router.replace('/')
                    }}
                >
                    <Center>
                        <Icon
                            mb="1"
                            as={
                                <MaterialCommunityIcons
                                    name={
                                        pathname === '/'
                                            ? 'home'
                                            : 'home-outline'
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
                    opacity={pathname === '/history' ? 1 : 0.5}
                    py="2"
                    flex={1}
                    onPress={() => {
                        router.replace('/history')
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
                    opacity={pathname === '/account' ? 1 : 0.6}
                    py="2"
                    flex={1}
                    onPress={() => {
                        router.replace('/account')
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
