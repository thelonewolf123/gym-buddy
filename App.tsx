import { Box, NativeBaseProvider } from 'native-base'
import { SafeAreaView } from 'react-native'

import { Index } from './view'

export default function App() {
    return (
        <NativeBaseProvider>
            <SafeAreaView>
                <Index />
            </SafeAreaView>
        </NativeBaseProvider>
    )
}
