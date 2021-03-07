import { VersionString } from "../common/data"

export type FindCurrentVersionEvent = Readonly<{ type: "succeed-to-find"; version: VersionString }>
