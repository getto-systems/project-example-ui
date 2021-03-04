export type LocationPathname = string & { LocationPathname: never }
export type SecureScriptPath = string & { SecureScriptPath: never }

export type ConvertSecureScriptResult =
    | Readonly<{ valid: true; value: SecureScriptPath }>
    | Readonly<{ valid: false }>

export type LoadSecureScriptError = Readonly<{ type: "infra-error"; err: string }>
