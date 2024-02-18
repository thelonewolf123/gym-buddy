import { NativeBaseProvider } from 'native-base'

import { Index } from './src/view'
import { Login } from './src/view/login'

export default function App() {
    return (
        <NativeBaseProvider>
            <Login />
        </NativeBaseProvider>
    )
}
