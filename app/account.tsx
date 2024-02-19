import {
    Box,
    Button,
    Center,
    Container,
    FormControl,
    Heading,
    Input,
    Text,
    View
} from 'native-base'

import useAuth from '../hooks/useAuth'

export default function Account() {
    const { user, logout } = useAuth()

    if (!user) {
        return (
            <Center h="100%" w="90%">
                <Text>Loading...</Text>
            </Center>
        )
    }

    return (
        <Center w="100%" mt="4">
            <Heading size="lg">Account</Heading>
            <View w="90%">
                <FormControl>
                    <FormControl.Label>Name</FormControl.Label>
                    <Input value={user.name} isDisabled={true} />
                </FormControl>
                <FormControl>
                    <FormControl.Label>Username</FormControl.Label>
                    <Input value={user.username} isDisabled={true} />
                </FormControl>
                <FormControl>
                    <FormControl.Label>Email</FormControl.Label>
                    <Input value={user.email} isDisabled={true} />
                </FormControl>
            </View>
            <Button onPress={logout} mt="4" w="90%">
                Sign out
            </Button>
        </Center>
    )
}
