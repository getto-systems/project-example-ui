import { Pathname } from "./data";

export type Infra = {
    env: Env,
    location: PathnameLocation,
}

export type Env = Readonly<{
    secureServer: Readonly<string>,
}>

export interface PathnameLocation {
    pathname(): Pathname;
}
