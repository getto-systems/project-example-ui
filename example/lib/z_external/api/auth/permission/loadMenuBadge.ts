import { ApiResult } from "../../data"

export interface ApiAuthPermissionLoadMenuBadge {
    (nonce: SendApiNonce): Promise<RawLoadMenuBadgeResult>
}

type SendApiNonce = string
type RawLoadMenuBadgeResult = ApiResult<MenuBadge>
type MenuBadge = Record<string, number>

export function initApiAuthPermissionLoadMenuBadge(_apiServerURL: string): ApiAuthPermissionLoadMenuBadge {
    return async (_nonce: SendApiNonce): Promise<RawLoadMenuBadgeResult> => {
        // TODO ちゃんと実装する
        return { success: true, value: {} }
    }
}
