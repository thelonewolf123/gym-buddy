import { Stack } from 'expo-router'
import { Box, NativeBaseProvider } from 'native-base'
import React from 'react'

import { Navigation } from '../components/navigation'
import Index from './'

const Layout: React.FC<{}> = () => {
    return (
        <NativeBaseProvider>
            <Navigation>
                <Stack initialRouteName="Home" />
            </Navigation>
        </NativeBaseProvider>
    )
}

export default Layout
