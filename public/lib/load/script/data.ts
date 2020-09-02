export type Pathname = Readonly<{ pathname: Readonly<string> }>;
export function pathname(pathname: string): Pathname {
    return { pathname }
}

export type ScriptPath = Readonly<{ path: Readonly<string> }>;
export function scriptPath(path: string): ScriptPath {
    return { path }
}

export type LoadedScript =
    Readonly<{ success: false, err: LoadError }> |
    Readonly<{ success: true, path: ScriptPath }>
export function loadError(err: LoadError): LoadedScript {
    return { success: false, err }
}
export function loaded(path: ScriptPath): LoadedScript {
    return { success: true, path }
}

export type LoadError =
    Readonly<{ type: "infra-error", err: string }>
