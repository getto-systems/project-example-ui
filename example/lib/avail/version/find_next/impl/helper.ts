import { ConvertLocationResult } from "../../../../z_vendor/getto-application/location/infra"
import { VersionString } from "../../common/data"
import { ApplicationTargetPath, Version } from "../data"

export function applicationPath(
    version: string,
    target: ConvertLocationResult<ApplicationTargetPath>,
): string {
    const path = target.valid ? target.value : "/index.html"
    return `/${version}${path}`
}

export function versionToString(version: Version): VersionString {
    return `${version.major}.${version.minor}.${version.patch}${version.suffix}` as VersionString
}