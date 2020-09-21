import { Password } from "./data"

export function initPassword(password: string): Password {
    return password as _Password
}

export function passwordToString(password: Password): Readonly<string> {
    return password as unknown as string
}

type _Password = string & Password
