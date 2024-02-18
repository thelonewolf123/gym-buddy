import { useState } from 'react'
import { Button, Text, View } from 'react-native'

import { Counter } from '../components/counter'

export function Index() {
    const [state, setState] = useState(0)
    const increment = () => setState(state + 1)

    return (
        <View className="flex items-center justify-center w-full h-full">
            <Counter />
        </View>
    )
}
