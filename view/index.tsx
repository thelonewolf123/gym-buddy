import { useState } from 'react'
import { Button, Text, View } from 'react-native'

export function Index() {
    const [state, setState] = useState(0)
    const increment = () => setState(state + 1)

    return (
        <View>
            <Text>{state}</Text>
            <Button title="Increment" onPress={increment} />
        </View>
    )
}
