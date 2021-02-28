import { Remote } from "./infra"

export function unwrapRemoteError<M, V, E>(
    remote: Remote<M, V, E>,
    errorHandler: { (err: unknown): E },
): Remote<M, V, E> {
    return async (message) => {
        try {
            return await remote(message)
        } catch (err) {
            return { success: false, err: errorHandler(err) }
        }
    }
}
