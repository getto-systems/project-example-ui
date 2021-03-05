import { initLocationDetecter } from "../../../../z_vendor/getto-application/location/testHelper"

import { detectAuthSignViewType } from "./impl"

import { AuthSignViewLocationDetecter } from "./entryPoint"

import { authSignLinkParams } from "../../../../auth/sign/common/link/data"

export function initAuthSignViewLocationDetecter(currentURL: URL): AuthSignViewLocationDetecter {
    return initLocationDetecter(currentURL, detectAuthSignViewType(authSignLinkParams))
}
