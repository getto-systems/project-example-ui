import { ConvertLocationResult } from "../../z_vendor/getto-application/location/detecter"
import { AppTarget, Version } from "./data"

export function appTargetToPath(version: string, target: ConvertLocationResult<AppTarget>): string {
    const path = target.valid ? target.value : "/index.html"
    return `/${version}${path}`
}

export function versionToString(version: Version): string {
    return `${version.major}.${version.minor}.${version.patch}${version.suffix}`
}
