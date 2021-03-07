import { VersionString } from "../../../common/data"

export interface GetCurrentVersionCoreAction {
    getCurrent(): VersionString
}
