import { ScriptPath, CheckError } from "./data"

export type Infra = Readonly<{
    hostConfig: HostConfig,
    checkClient: CheckClient,
}>

export type HostConfig = Readonly<{
    secureServerHost: Readonly<string>,
}>

export interface CheckClient {
    checkStatus(scriptPath: ScriptPath): Promise<CheckResponse>
}

export type CheckResponse =
    Readonly<{ success: false, err: CheckError }> |
    Readonly<{ success: true }>
