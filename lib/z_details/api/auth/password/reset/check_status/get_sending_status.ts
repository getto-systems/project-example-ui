import {
    GetResetTokenSendingStatusResult_pb,
    GetResetTokenSendingStatus_pb,
} from "../../../../y_protobuf/auth_pb.js"

import { decodeProtobuf, encodeProtobuf } from "../../../../../../z_vendor/protobuf/helper"
import { apiStatusError, apiRequest, apiInfraError } from "../../../../helper"

import { ApiFeature } from "../../../../infra"

import { ApiCommonError, ApiResult } from "../../../../data"

interface GetSendingStatus {
    (sessionID: string): Promise<GetSendingStatusResult>
}

type GetSendingStatusResult = ApiResult<SendingTokenResult, ApiCommonError | GetSendingStatusError>
type SendingTokenResult =
    | Readonly<{ done: false; status: Readonly<{ sending: boolean }> }>
    | Readonly<{ done: true; send: false; err: SendingTokenError }>
    | Readonly<{ done: true; send: true }>

type SendingTokenError = "failed-to-connect-message-service"

type GetSendingStatusError =
    | Readonly<{ type: "invalid-reset" }>
    | Readonly<{ type: "already-reset" }>

export function newApi_GetResetTokenSendingStatus(feature: ApiFeature): GetSendingStatus {
    return async (sessionID): Promise<GetSendingStatusResult> => {
        try {
            const mock = true
            if (mock) {
                // TODO api の実装が終わったらつなぐ
                return { success: true, value: { done: true, send: true } }
            }

            const request = apiRequest(feature, "/auth/password/reset/status", "GET")
            const response = await fetch(request.url, {
                ...request.options,
                body: encodeProtobuf(GetResetTokenSendingStatus_pb, (message) => {
                    message.sessionId = sessionID
                }),
            })

            if (!response.ok) {
                return apiStatusError(response.status)
            }

            const result = decodeProtobuf(
                GetResetTokenSendingStatusResult_pb,
                await response.text(),
            )
            if (!result.success) {
                return { success: false, err: mapError(result) }
            }
            return {
                success: true,
                value: toSendTokenResult(result),
            }
        } catch (err) {
            return apiInfraError(err)
        }

        function toSendTokenResult(
            result: GetResetTokenSendingStatusResult_pb,
        ): SendingTokenResult {
            if (!result.value) {
                return { done: false, status: { sending: false } }
            }
            const value = result.value
            if (!value.done) {
                return { done: false, status: { sending: value.sendingStatus || false } }
            }
            if (!value.send) {
                return { done: true, send: false, err: "failed-to-connect-message-service" }
            }
            return { done: true, send: true }
        }
        function mapError(result: GetResetTokenSendingStatusResult_pb): GetSendingStatusError {
            if (!result.err || !result.err.type) {
                return { type: "invalid-reset" }
            }
            switch (result.err.type) {
                case GetResetTokenSendingStatusResult_pb.ErrorType.INVALID_RESET:
                    return { type: "invalid-reset" }

                case GetResetTokenSendingStatusResult_pb.ErrorType.ALREADY_RESET:
                    return { type: "already-reset" }
            }
        }
    }
}
