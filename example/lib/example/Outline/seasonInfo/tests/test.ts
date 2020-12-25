import { newSeasonInfoComponent, SeasonInfoRepository } from "./core"

import { initStaticClock } from "../../../../z_infra/clock/simulate"
import { initMemorySeasonRepository } from "../../../shared/season/impl/repository/season/memory"

import { Clock } from "../../../shared/season/infra"

import { SeasonInfoState } from "../component"

import { markSeason } from "../../../shared/season/data"

// season のデフォルトを取得する
const NOW = new Date("2021-01-01 10:00:00")

describe("SeasonInfo", () => {
    test("load from repository", (done) => {
        const { seasonInfo } = standardSeasonInfoComponent()

        seasonInfo.onStateChange(stateHandler())

        seasonInfo.load()

        function stateHandler(): Post<SeasonInfoState> {
            const stack: SeasonInfoState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-season":
                        // work in progress...
                        break

                    case "succeed-to-load":
                        expect(stack).toEqual([{ type: "succeed-to-load", season: { year: 2020 } }])
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

    test("not found; use default", (done) => {
        const { seasonInfo } = emptySeasonInfoComponent()

        seasonInfo.onStateChange(stateHandler())

        seasonInfo.load()

        function stateHandler(): Post<SeasonInfoState> {
            const stack: SeasonInfoState[] = []

            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-season":
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

function standardSeasonInfoComponent() {
    const repository = standardRepository()
    const clock = standardClock()
    const seasonInfo = newSeasonInfoComponent(repository, clock)

    return { seasonInfo }
}
function emptySeasonInfoComponent() {
    const repository = emptyRepository()
    const clock = standardClock()
    const seasonInfo = newSeasonInfoComponent(repository, clock)

    return { seasonInfo }
}

function standardRepository(): SeasonInfoRepository {
    return {
        seasons: initMemorySeasonRepository({
            stored: true,
            season: markSeason({ year: 2020 }),
        }),
    }
}
function emptyRepository(): SeasonInfoRepository {
    return {
        seasons: initMemorySeasonRepository({ stored: false }),
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
