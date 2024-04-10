import { useEffect, useRef, useState } from 'react'
import {
    EmitterSubscription,
    Keyboard,
    KeyboardEvent,
    Platform
} from 'react-native'

export const useKeyboardBottomInset = () => {
    const [bottom, setBottom] = useState(0)
    const subscriptions = useRef<EmitterSubscription[]>([])

    useEffect(() => {
        if (Platform.OS === 'ios') {
            subscriptions.current = [
                Keyboard.addListener(
                    'keyboardWillChangeFrame',
                    (e: KeyboardEvent) => {
                        if (
                            e.startCoordinates &&
                            e.endCoordinates.screenY <
                                e.startCoordinates.screenY
                        )
                            setBottom(e.endCoordinates.height)
                        else setBottom(0)
                    }
                )
            ]
        } else {
            subscriptions.current = [
                Keyboard.addListener('keyboardDidHide', () => setBottom(0)),
                Keyboard.addListener('keyboardDidShow', (e) =>
                    setBottom(e.endCoordinates.height)
                )
            ]
        }

        return () => {
            subscriptions.current.forEach((subscription) => {
                subscription.remove()
            })
        }
    }, [setBottom, subscriptions])

    return bottom
}
