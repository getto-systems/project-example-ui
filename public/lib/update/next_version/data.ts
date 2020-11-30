export type FindEvent =
    | Readonly<{ type: "failed-to-find"; err: FindError }>
    | Readonly<{ type: "succeed-to-find"; target: AppTarget }>

export type FindError =
    | Readonly<{ type: "out-of-versioned" }>
    | Readonly<{ type: "up-to-date" }>
    | Readonly<{ type: "failed-to-check"; err: CheckError }>

export type CheckError =
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "infra-error"; err: string }>

export type AppTarget =
    | Readonly<{ versioned: false; version: Version }>
    | Readonly<{ versioned: true; version: Version; pagePathname: PagePathname }>

export function appTargetToPath(app: AppTarget): string {
    return `/${versionToString(app.version)}${pathname()}`

    function pathname(): string {
        if (!app.versioned) {
            return "/index.html"
        }
        return app.pagePathname
    }
}

export type Version = Version_data & { Version: never }
type Version_data =
    | Readonly<{ valid: false }>
    | Readonly<{ valid: true; major: number; minor: number; patch: number; suffix: string }>
export function markVersion(version: Version_data): Version {
    return version as Version
}
export function versionToString(version: Version): string {
    if (!version.valid) {
        return "0.0.0-unknown"
    }
    return `${version.major}.${version.minor}.${version.patch}${version.suffix}`
}

export type PagePathname = string & { PagePathname: never }
export function markPagePathname(path: string): PagePathname {
    return path as PagePathname
}
