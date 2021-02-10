import { RawRemoteAccess, RemoteAccess, RemoteAccessError } from "./infra"

export type RemoteAccessConverter<M, S, V, R, E> = Readonly<{
    message: RemoteAccessMessageConverter<M, S>
    value: RemoteAccessValueConverter<V, R>
    error: RemoteAccessErrorConverter<E>
    unknown: RemoteAccessUnknownErrorConverter<E>
}>
export interface RemoteAccessMessageConverter<M, S> {
    (message: M): S
}
export interface RemoteAccessValueConverter<V, R> {
    (raw: R): V
}
export interface RemoteAccessErrorConverter<E> {
    (err: RemoteAccessError): E
}
export interface RemoteAccessUnknownErrorConverter<E> {
    (err: unknown): E
}

export function initConnectRemoteAccess<M, S, V, R, E>(
    access: RawRemoteAccess<S, R>,
    converter: RemoteAccessConverter<M, S, V, R, E>
): RemoteAccess<M, V, E> {
    return async (message) => {
        try {
            const result = await access(converter.message(message))
            if (!result.success) {
                return { success: false, err: converter.error(result.err) }
            }
            return { success: true, value: converter.value(result.value) }
        } catch (err) {
            return { success: false, err: converter.unknown(err) }
        }
    }
}
