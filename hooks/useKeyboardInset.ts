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
        subscriptions.current = [
            Keyboard.addListener('keyboardDidHide', () => setBottom(0)),
            Keyboard.addListener('keyboardDidShow', (e) =>
                setBottom(e.endCoordinates.height)
            )
        ]

        return () => {
            subscriptions.current.forEach((subscription) => {
                subscription.remove()
            })
        }
    }, [setBottom, subscriptions])

    return bottom
}
