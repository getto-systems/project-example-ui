export type ScriptPath = Readonly<{ scriptPath: Readonly<string> }>

export type CheckError =
    Readonly<{ type: "not-found" }> |
    Readonly<{ type: "infra-error", err: string }>
