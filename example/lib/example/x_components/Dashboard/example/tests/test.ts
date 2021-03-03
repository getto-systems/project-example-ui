import {
    DashboardRepository,
    DashboardRemoteAccess,
    newTestDashboardResource,
} from "../../EntryPoint/tests/core"

import {
    initStaticClock,
    staticClockPubSub,
} from "../../../../../z_vendor/getto-application/infra/clock/simulate"
import { initMemorySeasonRepository } from "../../../../shared/season/impl/repository/season/memory"

import { Clock } from "../../../../../z_vendor/getto-application/infra/clock/infra"
import {
    OutlineMenuExpandRepositoryPod,
    OutlineMenuExpandRepositoryValue,
    OutlineMenuTree,
} from "../../../../../auth/permission/outline/load/infra"

import { ExampleComponentState } from "../component"
import { newLoadOutlineMenuBadgeNoopRemote } from "../../../../../auth/permission/outline/load/infra/remote/loadMenuBadge/noop"
import { AuthzRepositoryPod, AuthzRepositoryValue } from "../../../../../common/authz/infra"
import { initMemoryDB } from "../../../../../z_vendor/getto-application/infra/repository/memory"
import { wrapRepository } from "../../../../../z_vendor/getto-application/infra/repository/helper"

// デフォルトの season を取得する
const NOW = new Date("2021-01-01 10:00:00")

describe("Example", () => {
    test("load season", (done) => {
        const { resource } = standardResource()

        resource.example.subscriber.subscribe(stateHandler())

        resource.example.ignite()

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
    const authz = initMemoryDB<AuthzRepositoryValue>()
    authz.set({ nonce: "api-nonce", roles: ["role"] })

    const menuExpands = initMemoryDB<OutlineMenuExpandRepositoryValue>()

    return {
        authz: <AuthzRepositoryPod>wrapRepository(authz),
        menuExpands: <OutlineMenuExpandRepositoryPod>wrapRepository(menuExpands),
        seasons: initMemorySeasonRepository({ stored: false }),
    }
}

function standardSimulator(): DashboardRemoteAccess {
    return {
        loadMenuBadge: newLoadOutlineMenuBadgeNoopRemote(),
    }
}

function standardClock(): Clock {
    return initStaticClock(NOW, staticClockPubSub())
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
