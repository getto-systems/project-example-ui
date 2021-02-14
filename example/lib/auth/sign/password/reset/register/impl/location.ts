import { AuthSearchParams } from "../../../../location/data"
import { markResetToken, ResetToken } from "../data"

export function detectResetToken(currentURL: URL): ResetToken {
    // ログイン前画面ではアンダースコアから始まるクエリを使用する
    return markResetToken(currentURL.searchParams.get(AuthSearchParams.passwordResetToken) || "")
}
