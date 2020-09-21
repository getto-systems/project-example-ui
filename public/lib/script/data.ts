export type PagePathname = { PagePathname: never }
export type ScriptPath = { ScriptPath: never }

export type CheckError =
    Readonly<{ type: "not-found" }> |
    Readonly<{ type: "infra-error", err: string }>

export type ScriptEvent =
    Readonly<{ type: "try-to-load", scriptPath: ScriptPath }> |
    Readonly<{ type: "failed-to-load", err: CheckError }>
