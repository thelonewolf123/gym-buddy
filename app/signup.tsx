import { router } from 'expo-router'
import {
    Box,
    Button,
    Center,
    FormControl,
    Heading,
    Input,
    ScrollView,
    Text,
    Toast,
    VStack
} from 'native-base'
import { useState } from 'react'

import useAuth from '../hooks/useAuth'

const SignUp = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [username, setUsername] = useState('')

    const [loading, setLoading] = useState(false)
    const { createAccount } = useAuth()
    const handleSignUp = () => {
        setLoading(true)
        createAccount({ username, name, email, password, passwordConfirm })
            .then(() => {
                router.replace('/')
                setLoading(false)
            })
            .catch((err) => {
                console.error(err.originalError)
                Toast.show({
                    title: 'Invalid credentials'
                })
                setLoading(false)
            })
    }

    return (
        <ScrollView w="100%" h="100%" bg="white" p="2" py="4">
            <Center w="100%">
                <Box p="2" w="90%" py="8">
                    <Heading
                        size="lg"
                        color="coolGray.800"
                        _dark={{
                            color: 'warmGray.50'
                        }}
                        fontWeight="semibold"
                    >
                        Welcome
                    </Heading>
                    <Heading
                        mt="1"
                        color="coolGray.600"
                        _dark={{
                            color: 'warmGray.200'
                        }}
                        fontWeight="medium"
                        size="xs"
                    >
                        Sign up to continue!
                    </Heading>
                    <VStack space={3} mt="5">
                        <FormControl>
                            <FormControl.Label>Name</FormControl.Label>
                            <Input
                                onChange={(e) => setName(e.nativeEvent.text)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Username</FormControl.Label>
                            <Input
                                onChange={(e) =>
                                    setUsername(e.nativeEvent.text)
                                }
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Email</FormControl.Label>
                            <Input
                                onChange={(e) => setEmail(e.nativeEvent.text)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Password</FormControl.Label>
                            <Input
                                type="password"
                                onChange={(e) =>
                                    setPassword(e.nativeEvent.text)
                                }
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>
                                Confirm Password
                            </FormControl.Label>
                            <Input
                                type="password"
                                onChange={(e) =>
                                    setPasswordConfirm(e.nativeEvent.text)
                                }
                            />
                        </FormControl>
                        <Button
                            mt="2"
                            colorScheme="indigo"
                            onPress={handleSignUp}
                        >
                            <Text className="text-white">Sign up</Text>
                        </Button>
                    </VStack>
                </Box>
            </Center>
        </ScrollView>
    )
}

export default SignUp
