import { Pathname } from "./data";

export type Infra = {
    env: ScriptEnv,
    location: PathnameLocation,
}

export type ScriptEnv = Readonly<{
    secureServerHost: Readonly<string>,
}>

export interface PathnameLocation {
    pathname(): Promise<PathnameFound>;
}

export type PathnameFound =
    Readonly<{ found: false, err: string }> |
    Readonly<{ found: true, pathname: Pathname }>
