export type Pathname = Readonly<{ pathname: Readonly<string> }>;
export type ScriptPath = Readonly<{ path: Readonly<string> }>;

export type LoadState =
    Readonly<{ state: "try-to-load", promise: Promise<LoadState> }> |
    Readonly<{ state: "failed-to-load", err: LoadError }> |
    Readonly<{ state: "succeed-to-load", path: ScriptPath }>;
export function tryToLoad(promise: Promise<LoadState>): LoadState {
    return { state: "try-to-load", promise }
}
export function failedToLoad(err: LoadError): LoadState {
    return { state: "failed-to-load", err }
}
export function succeedToLoad(path: ScriptPath): LoadState {
    return { state: "succeed-to-load", path }
}

export type LoadError =
    Readonly<{ type: "infra-error", err: string }>
