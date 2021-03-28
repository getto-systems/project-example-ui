import { apiCommonError, apiRequest } from "../../../../helper"

import { ApiFeature } from "../../../../infra"

import { ApiCommonError, ApiResult } from "../../../../data"

interface SendToken {
    (): Promise<SendTokenResult>
}

type SendTokenResult = ApiResult<true, ApiCommonError>

export function newApi_SendResetToken(feature: ApiFeature): SendToken {
    return async (): Promise<SendTokenResult> => {
        const mock = true
        if (mock) {
            // TODO api の実装が終わったらつなぐ
            return { success: true, value: true }
        }

        const request = apiRequest(feature, "/auth/password/reset/token/sender", "POST")
        const response = await fetch(request.url, request.options)

        if (!response.ok) {
            return { success: false, err: apiCommonError(response.status) }
        }
        return { success: true, value: true }
    }
}
