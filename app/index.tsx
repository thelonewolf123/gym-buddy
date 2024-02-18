import { Link } from 'expo-router'
import { View } from 'native-base'

import { Counter } from '../components/counter'

export default function Page() {
    return (
        <View className="flex items-center justify-center w-full h-full">
            <Counter />
            <Link href="/signup" className="text-blue-500">
                Sign Up
            </Link>
            <Link href="/login" className="text-blue-500">
                Login
            </Link>
        </View>
    )
}
