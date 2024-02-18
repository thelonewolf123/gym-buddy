import { Stack } from 'expo-router/stack'
import { NativeBaseProvider } from 'native-base'
import React from 'react'

const Layout: React.FC<{}> = () => {
    return (
        <NativeBaseProvider>
            <Stack />
        </NativeBaseProvider>
    )
}

export default Layout
