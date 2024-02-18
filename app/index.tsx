import { Link } from 'expo-router'
import { View } from 'native-base'

import { Counter } from '../components/counter'

export default function Index() {
    return (
        <View className="flex items-center justify-center w-full h-full">
            <Counter />
        </View>
    )
}
