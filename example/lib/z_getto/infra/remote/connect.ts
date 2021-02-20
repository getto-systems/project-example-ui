import { RawRemote, Remote, RemoteError } from "./infra"

export type RemoteAccessConverter<M, S, V, R, E> = Readonly<{
    message: RemoteAccessMessageConverter<M, S>
    value: RemoteAccessValueConverter<M, V, R>
    error: RemoteAccessErrorConverter<E>
    unknown: RemoteAccessUnknownErrorConverter<E>
}>
export interface RemoteAccessMessageConverter<M, S> {
    (message: M): S
}
export interface RemoteAccessValueConverter<M, V, R> {
    (raw: R, message: M): V
}
export interface RemoteAccessErrorConverter<E> {
    (err: RemoteError): E
}
export interface RemoteAccessUnknownErrorConverter<E> {
    (err: unknown): E
}

export function initConnectRemoteAccess<M, S, V, R, E>(
    access: RawRemote<S, R>,
    converter: RemoteAccessConverter<M, S, V, R, E>
): Remote<M, V, E> {
    return async (message) => {
        try {
            const result = await access(converter.message(message))
            if (!result.success) {
                return { success: false, err: converter.error(result.err) }
            }
            return { success: true, value: converter.value(result.value, message) }
        } catch (err) {
            return { success: false, err: converter.unknown(err) }
        }
    }
}
