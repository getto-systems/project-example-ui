import { apiCommonError, apiRequest } from "../../helper"

import { ApiFeature } from "../../infra"

import { ApiCommonError, ApiResult } from "../../data"

interface Clear {
    (): Promise<ClearResult>
}
type ClearResult = ApiResult<true, ApiCommonError>

export function newApi_ClearAuthTicket(feature: ApiFeature): Clear {
    return async (): Promise<ClearResult> => {
        const mock = true
        if (mock) {
            // TODO api の実装が終わったらつなぐ
            return { success: true, value: true }
        }

        const request = apiRequest(feature, "/auth/clear", "POST")
        const response = await fetch(request.url, request.options)

        if (!response.ok) {
            return { success: false, err: apiCommonError(response.status) }
        }

        return { success: true, value: true }
    }
}
