import { decodeProtobuf } from "../../../z_vendor/protobuf/helper"
import { ApiCommonError, ApiResult } from "../data"
import { apiCommonError, apiRequest } from "../helper"
import { ApiFeature } from "../infra"
import { GetMenuBadgeResult_pb } from "../y_protobuf/outline_pb.js"

interface GetMenu {
    (): Promise<GetMenuResult>
}

type GetMenuResult = ApiResult<MenuBadgeItem[], ApiCommonError>
type MenuBadgeItem = Readonly<{ path: string; count: number }>

export function newApi_GetMenuBadge(feature: ApiFeature): GetMenu {
    return async (): Promise<GetMenuResult> => {
        const mock = true
        if (mock) {
            // TODO api の実装が終わったらつなぐ
            return { success: true, value: [] }
        }

        const request = apiRequest(feature, "/outline/menu/badge", "GET")
        const response = await fetch(request.url, request.options)

        if (!response.ok) {
            return { success: false, err: apiCommonError(response.status) }
        }

        const result = decodeProtobuf(GetMenuBadgeResult_pb, await response.text())
        return {
            success: true,
            value: result.badge.map((item) => ({
                path: item.path || "",
                count: item.count || 0,
            })),
        }
    }
}
