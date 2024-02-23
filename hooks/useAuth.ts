import { router } from 'expo-router'
import { useCallback, useState } from 'react'

import { pb } from '../service'

export type UserType = {
    id: string
    username: string
    email: string
    name: string
}

export default function useAuth() {
    const [user, setState] = useState<UserType | null>(
        pb.authStore.model as UserType | null
    )

    const login = useCallback(async (email: string, password: string) => {
        await pb.collection('users').authWithPassword(email, password)
        setState(pb.authStore.model as UserType)
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
            if (password !== passwordConfirm) {
                throw new Error('Passwords do not match')
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters')
            }

            if (username.length < 3) {
                throw new Error('Username must be at least 3 characters')
            }

            if (name.length < 3) {
                throw new Error('Name must be at least 3 characters')
            }

            if (email.length < 3) {
                throw new Error('Email must be at least 3 characters')
            }

            if (email.indexOf('@') === -1) {
                throw new Error('Email must be valid')
            }

            await pb.collection('users').create({
                username,
                email,
                password,
                passwordConfirm,
                name
            })
            await login(email, password)
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
