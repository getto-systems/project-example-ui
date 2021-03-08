import { newTestDocumentResource } from "../../EntryPoint/tests/core"

import { ContentComponentState } from "../component"

describe("Content", () => {
    test("load content", (done) => {
        const { resource } = standardResource()

        resource.content.subscriber.subscribe(stateHandler())

        resource.content.ignite()

        function stateHandler(): Post<ContentComponentState> {
            const stack: ContentComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-content":
                        // work in progress...
                        break

                    case "succeed-to-load":
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-load",
                                path: { valid: true, value: "/docs/index.html" },
                            },
                        ])
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
    const url = standardURL()
    const resource = newTestDocumentResource(version, url)

    return { resource }
}

function standardVersion(): string {
    return "1.0.0"
}

function standardURL(): URL {
    return new URL("https://example.com/1.0.0/docs/index.html")
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
