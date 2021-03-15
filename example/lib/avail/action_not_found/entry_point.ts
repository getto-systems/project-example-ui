import { ApplicationEntryPoint } from "../../z_vendor/getto-application/action/action"

import { GetCurrentVersionResource } from "../version/action_get_current/resource"

export type NotFoundEntryPoint = ApplicationEntryPoint<NotFoundResource>

export type NotFoundResource = GetCurrentVersionResource
