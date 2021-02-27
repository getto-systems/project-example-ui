import { RemoteResult } from "./infra"

export async function unwrapRemoteError<V, E>(
    result: Promise<RemoteResult<V, E>>,
    errorHandler: { (err: unknown): E },
): Promise<RemoteResult<V, E>> {
    try {
        return await result
    } catch (err) {
        return { success: false, err: errorHandler(err) }
    }
}
