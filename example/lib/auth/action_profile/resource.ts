import { BaseTypes } from "../../example/action_base/resource"
import { LogoutResource } from "../sign/auth_ticket/action_logout/resource"

type ProfileTypes = BaseTypes<Resource>
type Resource = LogoutResource
export type ProfileView = ProfileTypes["view"]
export type ProfileResource = ProfileTypes["resource"]
