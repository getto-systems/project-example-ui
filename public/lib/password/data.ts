export type Password = string & { Password: never }
export function markPassword(password: string): Password {
    return password as Password
}
