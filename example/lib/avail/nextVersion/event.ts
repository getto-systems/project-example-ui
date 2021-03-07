import { ConvertLocationResult } from "../../z_vendor/getto-application/location/detecter"
import { AppTarget, FindError } from "./data"

export type FindEvent =
    | Readonly<{ type: "delayed-to-find" }>
    | Readonly<{ type: "failed-to-find"; err: FindError }>
    | Readonly<{
          type: "succeed-to-find"
          upToDate: boolean
          version: string
          target: ConvertLocationResult<AppTarget>
      }>
