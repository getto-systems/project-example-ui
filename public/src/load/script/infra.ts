import { Pathname } from "./data";

export type Infra = {
    env: ScriptEnv,
    location: PathnameLocation,
}

export type ScriptEnv = Readonly<{
    secureServer: Readonly<string>,
}>

export interface PathnameLocation {
    pathname(): Promise<Pathname>;
}
