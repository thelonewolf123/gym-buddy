export function uniqueId(len: number = 8) {
    const chars =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    let id = ''
    for (let i = 0; i < len; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return id
}
