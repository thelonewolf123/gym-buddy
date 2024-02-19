import { Link } from 'expo-router'
import { Fab, View } from 'native-base'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import { Counter } from '../components/counter'
import useAuth from '../hooks/useAuth'

export default function Index() {
    const { user } = useAuth()

    if (!user) {
        return (
            <View>
                <Link href={'/login'}>Login</Link>
            </View>
        )
    }

    return (
        <View className="flex items-center justify-center w-full h-full">
            <Counter />
            {/* <Fab
                renderInPortal={false}
                shadow={2}
                size="sm"
                icon={<MaterialCommunityIcons name="plus" />}
            /> */}
        </View>
    )
}
