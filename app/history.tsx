import { Link } from 'expo-router'
import { View } from 'native-base'

export default function History() {
    return (
        <View>
            <Link href={'/signup'}>Sign up</Link>
        </View>
    )
}
