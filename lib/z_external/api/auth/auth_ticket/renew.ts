import { AuthenticateResponse_pb } from "../../y_protobuf/auth_pb.js"

import { decodeProtobuf } from "../../../../z_vendor/protobuf/helper"
import { apiStatusError, apiRequest, apiInfraError } from "../../helper"

import { ApiFeature } from "../../infra"

import { ApiAuthenticateResponse, ApiCommonError, ApiResult } from "../../data"

interface Renew {
    (): Promise<RenewResult>
}
type RenewResult = ApiResult<ApiAuthenticateResponse, ApiCommonError>

export function newApi_RenewAuthTicket(feature: ApiFeature): Renew {
    return async (): Promise<RenewResult> => {
        try {
            const mock = true
            if (mock) {
                // TODO api の実装が終わったらつなぐ
                return { success: true, value: { roles: ["admin", "dev-docs"] } }
            }

            const request = apiRequest(feature, "/auth/renew", "POST")
            const response = await fetch(request.url, request.options)

            if (!response.ok) {
                return apiStatusError(response.status)
            }

            return {
                success: true,
                value: decodeProtobuf(AuthenticateResponse_pb, await response.text()),
            }
        } catch (err) {
            return apiInfraError(err)
        }
    }
}
