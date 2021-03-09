import { ApiResult } from "../data"

type ApiNonce = string
type LoadResult = ApiResult<MenuBadgeItem[], LoadError>
type MenuBadgeItem = Readonly<{ path: string; count: number }>

type LoadError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

interface Get {
    (nonce: ApiNonce): Promise<LoadResult>
}
export function initApi_GetMenuBadge(_apiServerURL: string): Get {
    return async (_nonce: ApiNonce): Promise<LoadResult> => {
        // TODO ちゃんと実装する
        return { success: true, value: [] }
    }
}
