import { Stack } from 'expo-router/stack'
import { Fab, Icon, NativeBaseProvider } from 'native-base'
import React from 'react'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import { Navigation } from '../components/navigation'

const Layout: React.FC<{}> = () => {
    return (
        <NativeBaseProvider>
            <Navigation>
                <Stack />
            </Navigation>

            <Fab
                renderInPortal={false}
                shadow={2}
                size="sm"
                icon={<MaterialCommunityIcons name="plus" />}
            />
        </NativeBaseProvider>
    )
}

export default Layout
