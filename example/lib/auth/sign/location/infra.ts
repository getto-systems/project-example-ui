import { GetSecureScriptPathPod } from "./action"

export type LocationActionInfra = GetSecureScriptPathInfra

export type GetSecureScriptPathInfra = Readonly<{
    config: GetSecureScriptPathConfig
}>
export type GetSecureScriptPathConfig = Readonly<{
    secureServerHost: string
}>

export interface GetSecureScriptPath {
    (infra: GetSecureScriptPathInfra): GetSecureScriptPathPod
}
