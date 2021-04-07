import { apiStatusError, apiRequest, apiInfraError } from "../../../../helper"

import { ApiFeature } from "../../../../infra"

import { ApiCommonError, ApiResult } from "../../../../data"

interface SendToken {
    (): Promise<SendTokenResult>
}

type SendTokenResult = ApiResult<true, ApiCommonError>

export function newApi_SendResetToken(feature: ApiFeature): SendToken {
    return async (): Promise<SendTokenResult> => {
        try {
            const mock = true
            if (mock) {
                // TODO api の実装が終わったらつなぐ
                return { success: true, value: true }
            }

            const request = apiRequest(feature, "/auth/password/reset/token/sender", "POST")
            const response = await fetch(request.url, request.options)

            if (!response.ok) {
                return apiStatusError(response.status)
            }
            return { success: true, value: true }
        } catch (err) {
            return apiInfraError(err)
        }
    }
}
