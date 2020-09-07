export type Pathname = Readonly<{ pathname: Readonly<string> }>;
export type ScriptPath = Readonly<{ path: Readonly<string> }>;

// TODO LoadState という名前を変えたい
export type LoadState =
    Readonly<{ state: "initial-load" }> |
    Readonly<{ state: "try-to-load" }> |
    Readonly<{ state: "failed-to-load", err: LoadError }> |
    Readonly<{ state: "succeed-to-load", path: ScriptPath }>;
export const initialLoad: LoadState = { state: "initial-load" }
export const tryToLoad: LoadState = { state: "try-to-load" }
export function failedToLoad(err: LoadError): LoadState {
    return { state: "failed-to-load", err }
}
export function succeedToLoad(path: ScriptPath): LoadState {
    return { state: "succeed-to-load", path }
}

export interface LoadStateEventHandler {
    (promise: Promise<LoadState>): void
}

export type LoadError =
    Readonly<{ type: "infra-error", err: string }>
