import { VersionString } from "../common/data";

export interface GetCurrentVersionMethod {
    (): VersionString
}
