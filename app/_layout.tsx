import { Stack } from 'expo-router'
import { Box, NativeBaseProvider } from 'native-base'
import React from 'react'

import { RealmProvider } from '@realm/react'

import { Navigation } from '../components/navigation'
import Index from './'

const Layout: React.FC<{}> = () => {
    return (
        <NativeBaseProvider>
            <RealmProvider>
                <Navigation>
                    <Stack initialRouteName="Home" />
                </Navigation>
            </RealmProvider>
        </NativeBaseProvider>
    )
}

export default Layout
