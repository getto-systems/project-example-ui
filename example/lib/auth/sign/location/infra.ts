export type ApplicationActionConfig = Readonly<{
    secureScriptPath: SecureScriptPathConfig
}>

export type SecureScriptPathInfra = Readonly<{
    config: SecureScriptPathConfig
}>

export type SecureScriptPathConfig = Readonly<{
    secureServerHost: string
}>
