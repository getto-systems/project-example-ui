import {
    DashboardRepository,
    DashboardSimulator,
    newDashboardResource,
} from "../../Dashboard/tests/core"

import { initStaticClock } from "../../../../z_infra/clock/simulate"
import { initMemoryApiCredentialRepository } from "../../../shared/credential/impl/repository/apiCredential/memory"
import { initMemoryMenuExpandRepository } from "../../../shared/menu/impl/repository/menuExpand/memory"
import { initMemorySeasonRepository } from "../../../shared/season/impl/repository/season/memory"

import { Clock } from "../../../../z_infra/clock/infra"
import { MenuBadge, MenuBadgeMap, MenuTree } from "../../../shared/menu/infra"

import { ExampleState } from "../component"

import { ApiNonce, markApiNonce, markApiRoles } from "../../../shared/credential/data"

// デフォルトの season を取得する
const NOW = new Date("2021-01-01 10:00:00")

describe("Example", () => {
    test("load season", (done) => {
        const { resource } = standardResource()

        resource.example.onStateChange(stateHandler())

        resource.example.load()

        function stateHandler(): Post<ExampleState> {
            const stack: ExampleState[] = []
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
    const resource = newDashboardResource(version, url, menuTree, repository, simulator, clock)

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

function standardRepository(): DashboardRepository {
    return {
        apiCredentials: initMemoryApiCredentialRepository(
            markApiNonce("api-nonce"),
            markApiRoles(["admin"])
        ),
        menuExpands: initMemoryMenuExpandRepository([]),
        seasons: initMemorySeasonRepository({ stored: false }),
    }
}

function standardSimulator(): DashboardSimulator {
    return {
        menuBadge: {
            getMenuBadge: async (_apiNonce: ApiNonce): Promise<MenuBadge> => {
                return new MenuBadgeMap()
            },
        },
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
