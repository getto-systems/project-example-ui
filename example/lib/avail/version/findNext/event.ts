import { ConvertLocationResult } from "../../../z_vendor/getto-application/location/detecter"

import { VersionString } from "../common/data"
import { ApplicationTargetPath, FindNextVersionError } from "./data"

export type FindNextVersionEvent =
    | Readonly<{ type: "delayed-to-find" }>
    | Readonly<{ type: "failed-to-find"; err: FindNextVersionError }>
    | Readonly<{
          type: "succeed-to-find"
          upToDate: boolean
          version: VersionString
          target: ConvertLocationResult<ApplicationTargetPath>
      }>
