import { LoginID } from "./data"

export function initLoginID(loginID: string): LoginID {
    return loginID as _LoginID
}

export function loginIDToString(loginID: LoginID): Readonly<string> {
    return loginID as unknown as string
}

type _LoginID = string & LoginID
