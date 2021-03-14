import { BaseTypes } from "../../example/view_base/entry_point"
import { LogoutResource } from "../sign/auth_info/action_logout/resource"

type ProfileTypes = BaseTypes<Resource>
type Resource = LogoutResource
export type ProfileEntryPoint = ProfileTypes["entryPoint"]
export type ProfileResource = ProfileTypes["resource"]
