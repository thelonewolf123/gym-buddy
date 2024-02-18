import Pocketbase from 'pocketbase'

import { pb } from './index'

export function createAccount({
    email,
    password,
    passwordConfirm,
    name
}: {
    email: string
    password: string
    passwordConfirm: string
    name: string
}) {
    return pb.collection('users').create({
        email,
        password,
        passwordConfirm,
        name
    })
}

export function login({
    email,
    password
}: {
    email: string
    password: string
}) {
    return pb.collection('users').authWithPassword(email, password)
}
