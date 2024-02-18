import PocketBase, { AsyncAuthStore } from 'pocketbase'

import AsyncStorage from '@react-native-async-storage/async-storage'

const store = new AsyncAuthStore({
    save: async (serialized) => AsyncStorage.setItem('pb_auth', serialized),
    initial: AsyncStorage.getItem('pb_auth')
})

export const pb = new PocketBase(process.env.POCKETBASE_URL, store)
