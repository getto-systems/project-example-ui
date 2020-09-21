export type LoginID = Readonly<_LoginID>

export function initLoginID(loginID: string): LoginID {
    return loginID as _LoginID
}

export function loginIDToString(loginID: LoginID): Readonly<string> {
    return `${loginID}`
}

type _LoginID = string & { LoginID: never }
