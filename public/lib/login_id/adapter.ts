import { LoginID } from "./data"

export function initLoginID(loginID: string): LoginID {
    return loginID as string & LoginID
}

export function loginIDToString(loginID: LoginID): string {
    return loginID as unknown as string
}
