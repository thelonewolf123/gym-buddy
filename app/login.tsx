import { Link, router } from 'expo-router'
import {
    Box,
    Button,
    Center,
    FormControl,
    Heading,
    HStack,
    Input,
    Spinner,
    Text,
    Toast,
    VStack
} from 'native-base'
import { useState } from 'react'

import useAuth from '../hooks/useAuth'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const handleLogin = () => {
        setLoading(true)
        login(email, password)
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
        <Center w="100%">
            <Box safeArea p="2" py="8" w="90%" maxW="290">
                <Heading
                    size="lg"
                    fontWeight="600"
                    color="coolGray.800"
                    _dark={{
                        color: 'warmGray.50'
                    }}
                >
                    Welcome
                </Heading>
                <Heading
                    mt="1"
                    _dark={{
                        color: 'warmGray.200'
                    }}
                    color="coolGray.600"
                    fontWeight="medium"
                    size="xs"
                >
                    Sign in to continue!
                </Heading>

                <VStack space={3} mt="5">
                    <FormControl>
                        <FormControl.Label>Email ID</FormControl.Label>
                        <Input onChange={(e) => setEmail(e.nativeEvent.text)} />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Password</FormControl.Label>
                        <Input
                            type="password"
                            onChange={(e) => setPassword(e.nativeEvent.text)}
                        />
                        <Link href={'/forget-password'}>Forget Password?</Link>
                    </FormControl>
                    <Button mt="2" colorScheme="indigo" onPress={handleLogin}>
                        {loading ? <Spinner /> : <Text>Sign in</Text>}
                    </Button>
                    <HStack mt="6" justifyContent="center">
                        <Text
                            fontSize="sm"
                            color="coolGray.600"
                            _dark={{
                                color: 'warmGray.200'
                            }}
                        >
                            I'm a new user.{' '}
                        </Text>
                        <Link href="/signup">
                            <Text
                                fontSize="sm"
                                color="blue.500"
                                _dark={{
                                    color: 'blue.300'
                                }}
                            >
                                Sign Up
                            </Text>
                        </Link>
                    </HStack>
                </VStack>
            </Box>
        </Center>
    )
}

export default Login
