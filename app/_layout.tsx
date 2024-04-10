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

                <Stack
                    initialRouteName="Home"
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#a855f7'
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold'
                        },
                        contentStyle: {
                            backgroundColor: '#d8b4fe'
                        }
                    }}
                />
            </RealmProvider>
        </NativeBaseProvider>
    )
}

export default Layout
