import { DashboardRepository, newTestDashboardResource } from "../../EntryPoint/tests/core"

import {
    initStaticClock,
    staticClockPubSub,
} from "../../../../../z_vendor/getto-application/infra/clock/simulate"
import { initMemorySeasonRepository } from "../../../../shared/season/impl/repository/season/memory"

import { Clock } from "../../../../../z_vendor/getto-application/infra/clock/infra"

import { ExampleComponentState } from "../component"

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
    const repository = standardRepository()
    const clock = standardClock()
    const resource = newTestDashboardResource(repository, clock)

    return { repository, resource }
}

function standardRepository(): DashboardRepository {
    return {
        seasons: initMemorySeasonRepository({ stored: false }),
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
