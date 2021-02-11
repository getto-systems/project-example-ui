import {
    ProfileTestRepository,
    ProfileTestRemoteAccess,
    newTestProfileResource,
} from "../../EntryPoint/tests/core"

import { initMemoryTypedStorage } from "../../../../../z_infra/storage/memory"
import { initStaticClock } from "../../../../../z_infra/clock/simulate"
import { initLoadMenuBadgeSimulateRemoteAccess } from "../../../../permission/menu/impl/remote/menuBadge/simulate"
import { initApiCredentialRepository } from "../../../../common/credential/impl/repository/apiCredential"
import { initMenuExpandRepository } from "../../../../permission/menu/impl/repository/menuExpand"
import { initMemorySeasonRepository } from "../../../../../example/shared/season/impl/repository/season/memory"

import { Clock } from "../../../../../z_infra/clock/infra"
import { MenuTree } from "../../../../permission/menu/infra"

import { LogoutComponentState } from "../component"

import { markApiCredential, markAuthAt, markTicketNonce } from "../../../../common/credential/data"
import { initAuthCredentialRepository } from "../../../../login/credentialStore/impl/repository/authCredential"
import { initTestAuthCredentialStorage } from "../../../../login/credentialStore/tests/storage"

const STORED_TICKET_NONCE = "stored-ticket-nonce" as const
const STORED_LOGIN_AT = new Date("2020-01-01 09:00:00")

// デフォルトの season を取得する
const NOW = new Date("2021-01-01 10:00:00")

describe("Example", () => {
    test("load season", (done) => {
        const { resource } = standardResource()

        resource.logout.addStateHandler(stateHandler())

        resource.logout.submit()

        function stateHandler(): Post<LogoutComponentState> {
            const stack: LogoutComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-logout":
                        // work in progress...
                        break

                    case "succeed-to-logout":
                        expect(stack).toEqual([{ type: "succeed-to-logout" }])
                        done()
                        break

                    case "failed-to-logout":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("notify error", (done) => {
        const { resource } = standardResource()

        resource.error.notify("error")
        done()
    })
})

function standardResource() {
    const version = standardVersion()
    const url = standardURL()
    const menuTree = standardMenuTree()
    const repository = standardRepository()
    const simulator = standardSimulator()
    const clock = standardClock()
    const resource = newTestProfileResource(version, url, menuTree, repository, simulator, clock)

    return { repository, resource }
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

function standardRepository(): ProfileTestRepository {
    return {
        authCredentials: initAuthCredentialRepository(
            initTestAuthCredentialStorage({
                ticketNonce: { set: true, value: markTicketNonce(STORED_TICKET_NONCE) },
                apiCredential: { set: true, value: markApiCredential({ apiRoles: ["role"] }) },
                lastAuthAt: { set: true, value: markAuthAt(STORED_LOGIN_AT) },
            })
        ),
        apiCredentials: initApiCredentialRepository({
            apiCredential: initMemoryTypedStorage({
                set: true,
                value: markApiCredential({
                    // TODO apiNonce を追加
                    //apiNonce: markApiNonce("api-nonce"),
                    apiRoles: ["admin"],
                }),
            }),
        }),
        menuExpands: initMenuExpandRepository({
            menuExpand: initMemoryTypedStorage({ set: false }),
        }),
        seasons: initMemorySeasonRepository({ stored: false }),
    }
}

function standardSimulator(): ProfileTestRemoteAccess {
    return {
        loadMenuBadge: initLoadMenuBadgeSimulateRemoteAccess(() => ({ success: true, value: {} }), {
            wait_millisecond: 0,
        }),
    }
}

function standardClock(): Clock {
    return initStaticClock(NOW)
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
