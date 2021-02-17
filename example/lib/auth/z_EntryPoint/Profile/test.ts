import {
    initOutlineBreadcrumbListAction,
    initOutlineMenuAction,
    initOutlineActionLocationInfo,
} from "../../permission/outline/load/impl"

import { newStaticClock } from "../../../z_infra/clock/simulate"
import { initMemoryTypedStorage } from "../../../z_infra/storage/memory"
import { initOutlineMenuExpandRepository } from "../../permission/outline/load/infra/repository/outlineMenuExpand/core"
import { initMemorySeasonRepository } from "../../../example/shared/season/impl/repository/season/memory"
import { initLoadOutlineMenuBadgeSimulateRemoteAccess } from "../../permission/outline/load/infra/remote/loadOutlineMenuBadge/simulate"

import { initAuthProfileResource } from "./impl"

import { initSeasonInfoComponent } from "../../../example/x_components/Outline/seasonInfo/impl"

import { initTestSeasonAction } from "../../../example/shared/season/tests/season"

import { Clock } from "../../../z_infra/clock/infra"
import { OutlineMenuTree } from "../../permission/outline/load/infra"

import { ProfileFactory } from "./entryPoint"
import { markAuthAt, markAuthnNonce } from "../../sign/kernel/authnInfo/common/data"
import { initMemoryApiCredentialRepository } from "../../../common/apiCredential/infra/repository/memory"
import { markApiNonce, markApiRoles } from "../../../common/apiCredential/data"
import { initMemoryAuthnInfoRepository } from "../../sign/kernel/authnInfo/common/infra/repository/authnInfo/memory"
import { initNotifyUnexpectedErrorSimulateRemoteAccess } from "../../../availability/unexpectedError/infra/remote/notifyUnexpectedError/simulate"
import { initUnexpectedErrorAction } from "../../../availability/unexpectedError/impl"
import { initClearAuthnInfoAction } from "../../sign/x_Action/AuthnInfo/Clear/impl"

const STORED_AUTHN_NONCE = "stored-authn-nonce" as const
const STORED_LOGIN_AT = new Date("2020-01-01 09:00:00")

// renew リクエストを投げるべきかの判定に使用する
// SUCCEED_TO_LOGIN_AT と setContinuousRenew の delay との間でうまく調整する
const NOW = new Date("2020-01-01 10:00:30")

describe("AuthProfile", () => {
    test("init", (done) => {
        standardResource()
        done()
    })
})

function standardResource() {
    const version = standardVersion()
    const url = standardURL()
    const menuTree = standardMenuTree()
    const repository = standardRepository()
    const remote = standardRemoteAccess()
    const clock = standardClock()

    const locationInfo = initOutlineActionLocationInfo(version, url)
    const factory: ProfileFactory = {
        actions: {
            error: initUnexpectedErrorAction({
                notify: initNotifyUnexpectedErrorSimulateRemoteAccess(),
            }),
            breadcrumbList: initOutlineBreadcrumbListAction(locationInfo, { menuTree }),
            menu: initOutlineMenuAction(locationInfo, {
                ...repository,
                ...remote,
                menuTree,
            }),

            season: initTestSeasonAction(repository.seasons, clock),
        },
        components: {
            seasonInfo: initSeasonInfoComponent,
        },
    }

    return initAuthProfileResource(factory, {
        clear: initClearAuthnInfoAction({ clear: repository }),
    })
}

function standardVersion(): string {
    return "1.0.0"
}

function standardURL(): URL {
    return new URL("https://example.com/1.0.0/index.html")
}

function standardMenuTree(): OutlineMenuTree {
    return []
}

function standardRepository() {
    return {
        apiCredentials: initMemoryApiCredentialRepository({
            set: true,
            value: {
                apiNonce: markApiNonce("api-nonce"),
                apiRoles: markApiRoles(["role"]),
            },
        }),
        authnInfos: initMemoryAuthnInfoRepository({
            authnNonce: { set: true, value: markAuthnNonce(STORED_AUTHN_NONCE) },
            lastAuthAt: { set: true, value: markAuthAt(STORED_LOGIN_AT) },
        }),
        menuExpands: initOutlineMenuExpandRepository({
            menuExpand: initMemoryTypedStorage({ set: false }),
        }),
        seasons: initMemorySeasonRepository({ stored: false }),
    }
}

function standardRemoteAccess() {
    return {
        loadMenuBadge: initLoadOutlineMenuBadgeSimulateRemoteAccess(
            () => ({ success: true, value: {} }),
            {
                wait_millisecond: 0,
            }
        ),
    }
}

function standardClock(): Clock {
    return newStaticClock(NOW)
}
