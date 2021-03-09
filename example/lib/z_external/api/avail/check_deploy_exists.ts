import { ApiResult } from "../data"

type CheckURL = string

type RemoteResult = ApiResult<RemoteResponse, RemoteError>
type RemoteResponse = Readonly<{ found: boolean }>
type RemoteError =
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "infra-error"; err: string }>

interface CheckDeployExists {
    (url: CheckURL): Promise<RemoteResult>
}
export function newApi_CheckDeployExists(): CheckDeployExists {
    return async (url: CheckURL): Promise<RemoteResult> => {
        const response = await fetch(url, { method: "HEAD" })
        if (!response.ok) {
            if (response.status >= 500) {
                return { success: false, err: { type: "server-error" } }
            }
            return { success: true, value: { found: false } }
        }
        return { success: true, value: { found: true } }
    }
}
