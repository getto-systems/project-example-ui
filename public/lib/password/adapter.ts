import { Password } from "./data"

export function packPassword(password: string): Password {
    return password as Password & string
}

export function unpackPassword(password: Password): string {
    return password as unknown as string
}
