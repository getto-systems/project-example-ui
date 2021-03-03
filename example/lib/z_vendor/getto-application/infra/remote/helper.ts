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
