import { detectMenuTarget } from "../../permission/menu/impl/location"

import { initStaticClock } from "../../../z_infra/clock/simulate"
import { initTestAuthCredentialStorage } from "../../sign/authCredential/renew/tests/storage"
import { initAuthCredentialRepository } from "../../sign/authCredential/renew/infra/repository/authCredential"
import { initMemoryTypedStorage } from "../../../z_infra/storage/memory"
import { initMenuExpandRepository } from "../../permission/menu/impl/repository/menuExpand"
import { initMemorySeasonRepository } from "../../../example/shared/season/impl/repository/season/memory"
import { initLoadMenuBadgeSimulateRemoteAccess } from "../../permission/menu/impl/remote/menuBadge/simulate"

import { initProfileResource } from "./impl"

import { initBreadcrumbListComponent } from "../Outline/breadcrumbList/impl"
import { initMenuListComponent } from "../Outline/menuList/impl"
import { initSeasonInfoComponent } from "../../../example/x_components/Outline/seasonInfo/impl"
import { initNotifyComponent } from "../../../availability/x_Resource/NotifyError/Notify/impl"

import { initTestLogoutAction } from "../../sign/authCredential/renew/tests/logout"
import { initTestSeasonAction } from "../../../example/shared/season/tests/season"
import { initTestMenuAction } from "../../permission/menu/tests/menu"
import { initTestNotifyAction } from "../../../availability/error/notify/tests/notify"

import { Clock } from "../../../z_infra/clock/infra"
import { MenuTree } from "../../permission/menu/infra"

import { ProfileFactory, ProfileLocationInfo } from "./entryPoint"
import { markAuthAt, markTicketNonce } from "../../sign/authCredential/renew/data"
import { initMemoryApiCredentialRepository } from "../../../common/auth/apiCredential/impl"
import { markApiNonce, markApiRoles } from "../../../common/auth/apiCredential/data"

const STORED_TICKET_NONCE = "stored-ticket-nonce" as const
const STORED_LOGIN_AT = new Date("2020-01-01 09:00:00")

// renew リクエストを投げるべきかの判定に使用する
// SUCCEED_TO_LOGIN_AT と setContinuousRenew の delay との間でうまく調整する
const NOW = new Date("2020-01-01 10:00:30")

describe("Profile", () => {
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

    const factory: ProfileFactory = {
        actions: {
            notify: initTestNotifyAction(),
            menu: initTestMenuAction(
                repository.apiCredentials,
                menuTree,
                repository.menuExpands,
                remote.loadMenuBadge
            ),
            season: initTestSeasonAction(repository.seasons, clock),
            logout: initTestLogoutAction(repository.apiCredentials, repository.authCredentials),
        },
        components: {
            error: initNotifyComponent,
            seasonInfo: initSeasonInfoComponent,
            menuList: initMenuListComponent,
            breadcrumbList: initBreadcrumbListComponent,
        },
    }
    const locationInfo: ProfileLocationInfo = {
        menu: {
            getMenuTarget: () => detectMenuTarget(version, url),
        },
    }

    return initProfileResource(factory, locationInfo)
}

function standardVersion(): string {
    return "1.0.0"
}

function standardURL(): URL {
    return new URL("https://example.com/1.0.0/index.html")
}

function standardMenuTree(): MenuTree {
    return []
}

function standardRepository() {
    return {
        apiCredentials: initMemoryApiCredentialRepository({
            set: true,
            value: { nonce: markApiNonce("api-nonce"), roles: markApiRoles(["role"]) },
        }),
        authCredentials: initAuthCredentialRepository(
            initTestAuthCredentialStorage({
                ticketNonce: { set: true, value: markTicketNonce(STORED_TICKET_NONCE) },
                lastAuthAt: { set: true, value: markAuthAt(STORED_LOGIN_AT) },
            })
        ),
        menuExpands: initMenuExpandRepository({
            menuExpand: initMemoryTypedStorage({ set: false }),
        }),
        seasons: initMemorySeasonRepository({ stored: false }),
    }
}

function standardRemoteAccess() {
    return {
        loadMenuBadge: initLoadMenuBadgeSimulateRemoteAccess(() => ({ success: true, value: {} }), {
            wait_millisecond: 0,
        }),
    }
}

function standardClock(): Clock {
    return initStaticClock(NOW)
}
