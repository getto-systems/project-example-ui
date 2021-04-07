import { ResetPasswordResult_pb, ResetPassword_pb } from "../../../y_protobuf/auth_pb.js"

import { decodeProtobuf, encodeProtobuf } from "../../../../../z_vendor/protobuf/helper"
import { apiStatusError, apiRequest, apiInfraError } from "../../../helper"

import { ApiFeature } from "../../../infra"

import { ApiAuthenticateResponse, ApiCommonError, ApiResult } from "../../../data"

interface Reset {
    (params: ResetParams): Promise<ResetResult>
}

type ResetParams = Readonly<{
    resetToken: string
    fields: Readonly<{
        loginID: string
        password: string
    }>
}>
type ResetResult = ApiResult<ApiAuthenticateResponse, ApiCommonError | ResetError>
type ResetError = Readonly<{ type: "invalid-reset" }> | Readonly<{ type: "already-reset" }>

export function newApi_ResetPassword(feature: ApiFeature): Reset {
    return async (params: ResetParams): Promise<ResetResult> => {
        try {
            const mock = true
            if (mock) {
                // TODO api の実装が終わったらつなぐ
                return { success: true, value: { roles: ["admin", "dev-docs"] } }
            }

            const request = apiRequest(feature, "/auth/password/reset", "POST")
            const response = await fetch(request.url, {
                ...request.options,
                body: encodeProtobuf(ResetPassword_pb, (message) => {
                    message.resetToken = params.resetToken
                    message.loginId = params.fields.loginID
                    message.password = params.fields.password
                }),
            })

            if (!response.ok) {
                return apiStatusError(response.status)
            }

            const result = decodeProtobuf(ResetPasswordResult_pb, await response.text())
            if (!result.success) {
                return { success: false, err: mapError(result) }
            }
            return {
                success: true,
                value: {
                    roles: result.value?.roles || [],
                },
            }
        } catch (err) {
            return apiInfraError(err)
        }

        function mapError(result: ResetPasswordResult_pb): ResetError {
            if (!result.err || !result.err.type) {
                return { type: "invalid-reset" }
            }
            switch (result.err.type) {
                case ResetPasswordResult_pb.ErrorType.INVALID_RESET:
                    return { type: "invalid-reset" }

                case ResetPasswordResult_pb.ErrorType.ALREADY_RESET:
                    return { type: "already-reset" }
            }
        }
    }
}
