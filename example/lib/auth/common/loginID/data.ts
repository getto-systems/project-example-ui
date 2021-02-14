export type LoginID = string & { LoginID: never }
export function markLoginID(loginID: string): LoginID {
    return loginID as LoginID
}
