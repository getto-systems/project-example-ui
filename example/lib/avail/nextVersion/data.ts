export type AppTarget = string & { AppTarget: never }

export type Version = Version_data & { Version: never }
type Version_data = Readonly<{ major: number; minor: number; patch: number; suffix: string }>

export type ParseVersionResult =
    | Readonly<{ valid: true; value: Version }>
    | Readonly<{ valid: false }>

export type FindError = Readonly<{ type: "failed-to-check"; err: CheckError }>

export type CheckError = CheckRemoteError
export type CheckRemoteError =
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "infra-error"; err: string }>
