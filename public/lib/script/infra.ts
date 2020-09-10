import { Pathname, PathnameError } from "./data";

export type Infra = {
    env: ScriptEnv,
    location: PathnameLocation,
}

export type ScriptEnv = Readonly<{
    secureServerHost: Readonly<string>,
}>

export interface PathnameLocation {
    pathname(): PathnameResponse
}

export type PathnameResponse =
    Readonly<{ success: false, err: PathnameError }> |
    Readonly<{ success: true, pathname: Pathname }>
