import { ApiAccessResult } from "../../data"

interface Load {
    (nonce: ApiNonce): Promise<LoadResult>
}

type ApiNonce = string
type LoadResult = ApiAccessResult<MenuBadgeItem[], LoadError>
type MenuBadgeItem = Readonly<{ path: string; count: number }>

type LoadError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export function initApiLoadOutlineMenuBadge(_apiServerURL: string): Load {
    return async (_nonce: ApiNonce): Promise<LoadResult> => {
        // TODO ちゃんと実装する
        return { success: true, value: [] }
    }
}
