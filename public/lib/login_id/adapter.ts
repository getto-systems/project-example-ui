import { LoginID } from "./data"

export function packLoginID(loginID: string): LoginID {
    return loginID as LoginID & string
}

export function unpackLoginID(loginID: LoginID): string {
    return (loginID as unknown) as string
}
