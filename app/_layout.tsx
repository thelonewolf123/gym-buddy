import { Stack } from 'expo-router'
import { NativeBaseProvider } from 'native-base'
import React, { useMemo } from 'react'

import { Navigation } from '../components/navigation'
import RealmInit from '../components/realm-init'
import { WorkoutRealmContext } from '../database/realm.db'

const Layout: React.FC<{}> = () => {
    const { RealmProvider } = useMemo(() => WorkoutRealmContext, [])

    return (
        <NativeBaseProvider>
            <RealmProvider>
                <RealmInit />
            </RealmProvider>
            <Navigation>
                <Stack initialRouteName="Home" />
            </Navigation>
        </NativeBaseProvider>
    )
}

export default Layout
