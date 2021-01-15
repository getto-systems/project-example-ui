import { newNotFoundResource } from "../../NotFound/tests/core"

import { CurrentVersionState } from "../component"

describe("NotFound", () => {
    test("load current version", (done) => {
        const { resource } = standardResource()

        resource.currentVersion.onStateChange(stateHandler())

        resource.currentVersion.load()

        function stateHandler(): Post<CurrentVersionState> {
            const stack: CurrentVersionState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-current-version":
                        // work in progress...
                        break

                    case "succeed-to-find":
                        expect(stack).toEqual([{ type: "succeed-to-find", version: "1.0.0" }])
                        done()
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
    const resource = newNotFoundResource(version)

    return { resource }
}

function standardVersion(): string {
    return "1.0.0"
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
