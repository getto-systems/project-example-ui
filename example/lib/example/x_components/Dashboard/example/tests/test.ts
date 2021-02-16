import {
    DashboardRepository,
    DashboardRemoteAccess,
    newTestDashboardResource,
} from "../../EntryPoint/tests/core"

import { initMemoryTypedStorage } from "../../../../../z_infra/storage/memory"
import { initStaticClock } from "../../../../../z_infra/clock/simulate"
import { initLoadOutlineMenuBadgeSimulateRemoteAccess } from "../../../../../auth/permission/outline/load/infra/remote/loadOutlineMenuBadge/simulate"
import { initOutlineMenuExpandRepository } from "../../../../../auth/permission/outline/load/infra/repository/outlineMenuExpand/core"
import { initMemorySeasonRepository } from "../../../../shared/season/impl/repository/season/memory"

import { Clock } from "../../../../../z_infra/clock/infra"
import { OutlineMenuTree } from "../../../../../auth/permission/outline/load/infra"

import { ExampleComponentState } from "../component"
import { initMemoryApiCredentialRepository } from "../../../../../common/apiCredential/infra/repository/memory"
import { markApiNonce, markApiRoles } from "../../../../../common/apiCredential/data"

// デフォルトの season を取得する
const NOW = new Date("2021-01-01 10:00:00")

describe("Example", () => {
    test("load season", (done) => {
        const { resource } = standardResource()

        resource.example.addStateHandler(stateHandler())

        resource.example.load()

        function stateHandler(): Post<ExampleComponentState> {
            const stack: ExampleComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-example":
                        // work in progress...
                        break

                    case "succeed-to-load":
                        expect(stack).toEqual([{ type: "succeed-to-load", season: { year: 2021 } }])
                        done()
                        break

                    case "failed-to-load":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })
})

function standardResource() {
    const version = standardVersion()
    const url = standardURL()
    const menuTree = standardMenuTree()
    const repository = standardRepository()
    const simulator = standardSimulator()
    const clock = standardClock()
    const resource = newTestDashboardResource(version, url, menuTree, repository, simulator, clock)

    return { repository, resource }
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

function standardRepository(): DashboardRepository {
    return {
        apiCredentials: initMemoryApiCredentialRepository({
            set: true,
            value: { apiNonce: markApiNonce("api-nonce"), apiRoles: markApiRoles(["role"]) },
        }),
        menuExpands: initOutlineMenuExpandRepository({
            menuExpand: initMemoryTypedStorage({ set: false }),
        }),
        seasons: initMemorySeasonRepository({ stored: false }),
    }
}

function standardSimulator(): DashboardRemoteAccess {
    return {
        loadMenuBadge: initLoadOutlineMenuBadgeSimulateRemoteAccess(() => ({ success: true, value: {} }), {
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
