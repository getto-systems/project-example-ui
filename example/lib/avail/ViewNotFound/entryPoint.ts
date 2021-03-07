import { ApplicationEntryPoint } from "../../z_vendor/getto-application/action/action"

import { GetCurrentVersionResource } from "../version/getCurrent/Action/resource"

export type NotFoundEntryPoint = ApplicationEntryPoint<NotFoundResource>

export type NotFoundResource = GetCurrentVersionResource
