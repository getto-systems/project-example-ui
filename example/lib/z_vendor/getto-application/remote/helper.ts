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

export function mapRemoteMessage<S, M, V, E>(
    remote: Remote<M, V, E>,
    map: Mapper<S, M>,
): Remote<S, V, E> {
    return (source) => remote(map(source))
}
export function mapRemoteResultValue<M, R, V, E>(
    remote: Remote<M, R, E>,
    map: Mapper<R, V>,
): Remote<M, V, E> {
    return async (message) => {
        const result = await remote(message)
        if (!result.success) {
            return result
        }
        return { success: true, value: map(result.value) }
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
