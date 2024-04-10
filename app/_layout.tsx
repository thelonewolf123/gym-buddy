import { Stack } from 'expo-router'
import { NativeBaseProvider } from 'native-base'
import React, { useMemo } from 'react'
import EventSource from 'react-native-sse'

import RealmInit from '../components/realm-init'
import { WorkoutRealmContext } from '../database/realm.db'

// @ts-ignore
global.EventSource = EventSource // needed for pocket base sse

const Layout: React.FC<{}> = () => {
    const { RealmProvider } = useMemo(() => WorkoutRealmContext, [])

    return (
        <NativeBaseProvider>
            <RealmProvider>
                <RealmInit />

                <Stack initialRouteName="Home" />
            </RealmProvider>
        </NativeBaseProvider>
    )
}

export default Layout
