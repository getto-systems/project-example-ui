import { GetSecureScriptPathPod } from "./action"

export type AuthLocationActionInfra = GetSecureScriptPathInfra

export type GetSecureScriptPathInfra = Readonly<{
    config: Readonly<{
        secureServerHost: string
    }>
}>

export interface GetSecureScriptPath {
    (infra: GetSecureScriptPathInfra): GetSecureScriptPathPod
}
