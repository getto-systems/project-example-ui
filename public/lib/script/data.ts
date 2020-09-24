export type PagePathname = { PagePathname: never }
export type ScriptPath = { ScriptPath: never }

export type ScriptEvent =
    Readonly<{ type: "try-to-load", scriptPath: ScriptPath }>
