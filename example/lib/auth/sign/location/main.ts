import { env } from "../../../y_environment/env"

import { detectPagePathname, initLocationAction } from "./impl"

import { LocationAction } from "./action"
import { currentURL } from "../../../z_infra/location/url"

export function newLocationAction(): LocationAction {
    return initLocationAction(
        {
            getPagePathname: () => detectPagePathname(currentURL()),
        },
        {
            config: {
                secureServerHost: env.secureServerHost,
            },
        }
    )
}
