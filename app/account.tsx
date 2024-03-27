import { Redirect, Stack } from 'expo-router'
import {
    Button,
    Center,
    FormControl,
    Heading,
    Input,
    Text,
    View
} from 'native-base'
import { TextInput } from 'react-native'

import useAuth from '../hooks/useAuth'

export default function Account() {
    const { user, logout } = useAuth()

    if (!user) {
        return <Redirect href={'/login'} />
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Account'
                }}
            ></Stack.Screen>
            <Center w="100%" mt="4">
                <View w="90%">
                    <FormControl>
                        <FormControl.Label>Name</FormControl.Label>
                        <Input value={user.name} isDisabled />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Username</FormControl.Label>
                        <Input value={user.username} isDisabled />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Email</FormControl.Label>
                        <Input value={user.email} isDisabled />
                    </FormControl>
                </View>
                <Button
                    onPress={logout}
                    mt="4"
                    w="90%"
                    background={'purple.500'}
                >
                    Sign out
                </Button>
            </Center>
        </>
    )
}
