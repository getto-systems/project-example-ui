import { ApiInfraError, ApiResult, ApiServerError } from "../data"
import { apiInfraError } from "../helper"

interface Check {
    (url: string): Promise<CheckResult>
}

type CheckResult = ApiResult<CheckResponse, CheckError>
type CheckResponse = Readonly<{ found: boolean }>
type CheckError = ApiServerError | ApiInfraError

export function newApi_CheckDeployExists(): Check {
    return async (url): Promise<CheckResult> => {
        try {
            const response = await fetch(url, { method: "HEAD" })
            if (!response.ok) {
                if (response.status >= 500) {
                    return { success: false, err: { type: "server-error" } }
                }
                return { success: true, value: { found: false } }
            }
            return { success: true, value: { found: true } }
        } catch (err) {
            return apiInfraError(err)
        }
    }
}
