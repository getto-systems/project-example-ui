export type PagePathname = { PagePathname: never }
export type ScriptPath = { ScriptPath: never }

export type LoadError = Readonly<{ type: "infra-error"; err: string }>
