import { RequestResetTokenResult_pb, RequestResetToken_pb } from "../../../y_protobuf/auth_pb.js"

import { decodeProtobuf, encodeProtobuf } from "../../../../../z_vendor/protobuf/helper"
import { apiStatusError, apiRequest, apiInfraError } from "../../../helper"

import { ApiFeature } from "../../../infra"

import { ApiCommonError, ApiResult } from "../../../data"

interface RequestToken {
    (fields: RequestTokenFields): Promise<RequestTokenResult>
}
type RequestTokenFields = Readonly<{
    loginID: string
}>
type RequestTokenResult = ApiResult<string, ApiCommonError | RequestTokenError>
type RequestTokenError = Readonly<{ type: "invalid-reset" }>

export function newApi_RequestResetToken(feature: ApiFeature): RequestToken {
    return async (fields): Promise<RequestTokenResult> => {
        try {
            const mock = true
            if (mock) {
                // TODO api の実装が終わったらつなぐ
                return { success: true, value: "reset-session-id" }
            }

            const request = apiRequest(feature, "/auth/password/reset/token", "POST")
            const response = await fetch(request.url, {
                ...request.options,
                body: encodeProtobuf(RequestResetToken_pb, (message) => {
                    message.loginId = fields.loginID
                }),
            })

            if (!response.ok) {
                return apiStatusError(response.status)
            }

            const result = decodeProtobuf(RequestResetTokenResult_pb, await response.text())
            if (!result.success) {
                return { success: false, err: mapError(result) }
            }
            return {
                success: true,
                value: result.value?.sessionId || "",
            }
        } catch (err) {
            return apiInfraError(err)
        }

        function mapError(_result: RequestResetTokenResult_pb): RequestTokenError {
            return { type: "invalid-reset" }
        }
    }
}
