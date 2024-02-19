import { Stack } from 'expo-router/stack'
import { NativeBaseProvider } from 'native-base'
import React from 'react'

import { Navigation } from '../components/navigation'

const Layout: React.FC<{}> = () => {
    return (
        <NativeBaseProvider>
            <Navigation>
                <Stack />
            </Navigation>
        </NativeBaseProvider>
    )
}

export default Layout
