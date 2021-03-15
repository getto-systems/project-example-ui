import { VersionString } from "../data"
import { ApplicationTargetPath, FindNextVersionError } from "./data"
import { ConvertLocationResult } from "../../../z_vendor/getto-application/location/data"

export type FindNextVersionEvent =
    | Readonly<{ type: "take-longtime-to-find" }>
    | Readonly<{ type: "failed-to-find"; err: FindNextVersionError }>
    | Readonly<{
          type: "succeed-to-find"
          upToDate: boolean
          version: VersionString
          target: ConvertLocationResult<ApplicationTargetPath>
      }>
