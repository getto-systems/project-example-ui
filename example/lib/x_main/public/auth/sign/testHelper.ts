import { initLocationDetecter } from "../../../../z_vendor/getto-application/location/testHelper"

import { detectAuthSignViewType } from "./impl"

import { AuthSignViewLocationDetecter } from "./entryPoint"

import { authSignSearchParams } from "../../../../auth/sign/common/searchParams/data"

export function initAuthSignViewLocationDetecter(currentURL: URL): AuthSignViewLocationDetecter {
    return initLocationDetecter(currentURL, detectAuthSignViewType(authSignSearchParams))
}
