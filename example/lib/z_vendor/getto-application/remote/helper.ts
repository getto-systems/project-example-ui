import { RawRemote, Remote } from "./infra"

export function wrapRemoteError<M, V>(access: RawRemote<M, V>): RawRemote<M, V> {
    return async (message) => {
        try {
            return await access(message)
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }
}

export function mapRemoteResultError<M, V, R, E>(
    remote: Remote<M, V, R>,
    map: Mapper<R, E>,
): Remote<M, V, E> {
    return async (message) => {
        const result = await remote(message)
        if (result.success) {
            return result
        }
        return { success: false, err: map(result.err) }
    }
}

interface Mapper<A, B> {
    (source: A): B
}
