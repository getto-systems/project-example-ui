import { ScriptPath, CheckError } from "./data"

export type Infra = Readonly<{
    config: Config,
    checkClient: CheckClient,
}>

export type Config = Readonly<{
    secureServerHost: Readonly<string>,
}>

export interface CheckClient {
    checkStatus(scriptPath: ScriptPath): Promise<CheckResponse>
}

export type CheckResponse =
    Readonly<{ success: false, err: CheckError }> |
    Readonly<{ success: true }>
