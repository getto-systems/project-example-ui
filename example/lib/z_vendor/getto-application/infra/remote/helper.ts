import { RemoteCommonError } from "./data"
import { Remote, RemotePod, RemoteResult } from "./infra"

export function wrapRemote<M, V, R, E>(
    remote: Remote<M, R, E>,
    errorHandler: { (err: unknown): E },
): RemotePod<M, V, R, E> {
    return (converter) => async (message) => {
        const remoteResult = await access(message)
        if (!remoteResult.success) {
            return remoteResult
        }
        return { success: true, value: converter(remoteResult.value) }
    }

    async function access(message: M): Promise<RemoteResult<R, E>> {
        try {
            return await remote(message)
        } catch (err) {
            return { success: false, err: errorHandler(err) }
        }
    }
}

export function passThroughRemoteValue<T>(value: T): T {
    return value
}

export function remoteCommonError(
    err: RemoteCommonError,
    message: { (reason: string): string },
): string[] {
    switch (err.type) {
        case "bad-request":
            return [message("アプリケーションエラー")]

        case "server-error":
            return [message("サーバーエラー")]

        case "bad-response":
            return [message("レスポンスエラー"), ...detail(err.err)]

        case "infra-error":
            return [message("ネットワークエラー"), ...detail(err.err)]
    }

    function detail(message: string): string[] {
        if (message.length === 0) {
            return []
        }
        return [`(詳細: ${message})`]
    }
}
