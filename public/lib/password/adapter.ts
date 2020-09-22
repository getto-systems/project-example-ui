import { Password } from "./data"

export function initPassword(password: string): Password {
    return password as string & Password
}

export function passwordToString(password: Password): string {
    return password as unknown as string
}
