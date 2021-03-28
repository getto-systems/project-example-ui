import { NotifyUnexpectedError_pb } from "../y_protobuf/avail_pb.js"

import { encodeProtobuf } from "../../../z_vendor/protobuf/helper"
import { apiCommonError, apiRequest } from "../helper"

import { ApiFeature } from "../infra"

import { ApiCommonError, ApiResult } from "../data"

interface Notify {
    (err: unknown): Promise<NotifyResult>
}

type NotifyResult = ApiResult<true, ApiCommonError>

export function newApi_NotifyUnexpectedError(feature: ApiFeature): Notify {
    return async (err): Promise<NotifyResult> => {
        const mock = true
        if (mock) {
            // TODO api の実装が終わったらつなぐ
            return { success: true, value: true }
        }

        const request = apiRequest(feature, "/avail/error/unexpected", "POST")
        const response = await fetch(request.url, {
            ...request.options,
            body: encodeProtobuf(NotifyUnexpectedError_pb, (message) => {
                message.json = JSON.stringify(err)
            }),
        })

        if (!response.ok) {
            return { success: false, err: apiCommonError(response.status) }
        }

        return { success: true, value: true }
    }
}
