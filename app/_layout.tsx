import { Stack } from 'expo-router'
import { NativeBaseProvider } from 'native-base'
import React, { useMemo } from 'react'
import EventSource from 'react-native-sse'

import { Navigation } from '../components/navigation'
import RealmInit from '../components/realm-init'
import { WorkoutRealmContext } from '../database/realm.db'

// @ts-ignore
global.EventSource = EventSource

const Layout: React.FC<{}> = () => {
    const { RealmProvider } = useMemo(() => WorkoutRealmContext, [])

    return (
        <NativeBaseProvider>
            <RealmProvider>
                <RealmInit />
                <Navigation>
                    <Stack initialRouteName="Home" />
                </Navigation>
            </RealmProvider>
        </NativeBaseProvider>
    )
}

export default Layout
