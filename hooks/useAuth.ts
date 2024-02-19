import { useCallback } from 'react'

import { pb } from '../service'

export default function useAuth() {
    const user = pb.authStore.model
    const login = useCallback(async (email: string, password: string) => {
        await pb.collection('users').authWithPassword(email, password)
    }, [])
    const logout = useCallback(async () => {
        await pb.authStore.clear()
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
