import { CheckError, Version } from "./data"

export type FindInfra = Readonly<{
    client: CheckClient
}>

export interface CheckClient {
    check(version: Version): Promise<CheckResponse>
}

export type CheckResponse =
    | Readonly<{ success: false; err: CheckError }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: true; found: true, version: Version }>
