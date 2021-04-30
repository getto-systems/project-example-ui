import { AuthenticatePassword_pb, AuthenticatePasswordResult_pb } from "../../y_protobuf/auth_pb.js"

import { decodeProtobuf, encodeProtobuf } from "../../../../z_vendor/protobuf/helper"
import { apiStatusError, apiRequest, apiInfraError } from "../../helper"

import { ApiFeature } from "../../infra"

import { ApiAuthenticateResponse, ApiCommonError, ApiResult } from "../../data"

interface Authenticate {
    (fields: AuthenticateFields): Promise<AuthenticateResult>
}
type AuthenticateFields = Readonly<{
    loginID: string
    password: string
}>

type AuthenticateResult = ApiResult<ApiAuthenticateResponse, ApiCommonError | AuthenticateError>
type AuthenticateError = Readonly<{ type: "invalid-password" }>

export function newApi_AuthenticatePassword(feature: ApiFeature): Authenticate {
    return async (fields): Promise<AuthenticateResult> => {
        try {
            const mock = false
            if (mock) {
                // TODO api の実装が終わったらつなぐ
                return { success: true, value: { roles: ["admin", "dev-docs"] } }
            }

            const request = apiRequest(feature, "/auth/password/authenticate", "POST")
            const response = await fetch(request.url, {
                ...request.options,
                body: encodeProtobuf(AuthenticatePassword_pb, (message) => {
                    message.loginId = fields.loginID
                    message.password = fields.password
                }),
            })

            if (!response.ok) {
                return apiStatusError(response.status)
            }

            const result = decodeProtobuf(AuthenticatePasswordResult_pb, await response.text())
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

        function mapError(_result: AuthenticatePasswordResult_pb): AuthenticateError {
            return { type: "invalid-password" }
        }
    }
}
