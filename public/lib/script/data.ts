export type PagePathname = Readonly<{ pagePathname: Readonly<string> }>
export type ScriptPath = Readonly<{ scriptPath: Readonly<string> }>

export type CheckError =
    Readonly<{ type: "not-found" }> |
    Readonly<{ type: "infra-error", err: string }>

export type ScriptEvent =
    Readonly<{ type: "try-to-load", scriptPath: ScriptPath }> |
    Readonly<{ type: "failed-to-load", err: CheckError }>
