export type Pathname = Readonly<{ pathname: Readonly<string> }>;
export type ScriptPath = Readonly<{ scriptPath: Readonly<string> }>;

export type PathnameError =
    Readonly<{ type: "infra-error", err: string }>

export type ScriptError =
    Readonly<{ type: "infra-error", err: string }>
