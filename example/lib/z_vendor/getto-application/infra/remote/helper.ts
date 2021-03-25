import { RemoteCommonError, RemoteInfraError } from "./data"
import { Remote, RemotePod, RemoteResult } from "./infra"

export function wrapRemote<M, V, R, E_raw, E_wrapped>(
    remote: Remote<M, R, E_raw>,
    errorHandler: { (err: unknown): E_wrapped },
): RemotePod<M, V, R, E_raw | E_wrapped> {
    return (converter) => async (message) => {
        const remoteResult = await access(message)
        if (!remoteResult.success) {
            return remoteResult
        }
        return { success: true, value: converter(remoteResult.value) }
    }

    async function access(message: M): Promise<RemoteResult<R, E_raw | E_wrapped>> {
        try {
            return await remote(message)
        } catch (err) {
            return { success: false, err: errorHandler(err) }
        }
    }
}
export function remoteInfraError(err: unknown): RemoteInfraError {
    return {
        type: "infra-error",
        err: `${err}`,
    }
}

export function passThroughRemoteValue<T>(value: T): T {
    return value
}

export type RemoteCommonErrorReason = Readonly<{
    message: string
    detail: string[]
}>
export function remoteCommonError<T>(
    err: RemoteCommonError,
    message: { (reason: RemoteCommonErrorReason): T[] },
): T[] {
    switch (err.type) {
        case "unauthorized":
            return message({
                message: "認証エラー",
                detail: ["もう一度ログインしてください"],
            })

        case "invalid-nonce":
            return message({
                message: "接続エラー",
                detail: ["繰り返し接続エラーになる場合、お手数ですが管理者に連絡お願いします"],
            })

        case "bad-request":
            return message({ message: "アプリケーションエラー", detail: [] })

        case "server-error":
            return message({ message: "サーバーエラー", detail: [] })

        case "bad-response":
            return message({ message: "レスポンスエラー", detail: detail(err.err) })

        case "infra-error":
            return message({ message: "ネットワークエラー", detail: detail(err.err) })
    }

    function detail(message: string): string[] {
        if (message.length === 0) {
            return []
        }
        return [`(詳細: ${message})`]
    }
}
