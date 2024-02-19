import { router } from 'expo-router'
import { useCallback } from 'react'

import { pb } from '../service'

type UserType = {
    id: string
    username: string
    email: string
    name: string
}

export default function useAuth() {
    const user = pb.authStore.model as UserType | null

    const login = useCallback(async (email: string, password: string) => {
        await pb.collection('users').authWithPassword(email, password)
    }, [])

    const logout = useCallback(async () => {
        await pb.authStore.clear()
        router.replace('/login')
    }, [])

    const createAccount = useCallback(
        async ({
            username,
            email,
            password,
            passwordConfirm,
            name
        }: {
            username: string
            email: string
            password: string
            passwordConfirm: string
            name: string
        }) => {
            await pb.collection('users').create({
                username,
                email,
                password,
                passwordConfirm,
                name
            })
        },
        []
    )

    return {
        user,
        login,
        logout,
        createAccount
    }
}
