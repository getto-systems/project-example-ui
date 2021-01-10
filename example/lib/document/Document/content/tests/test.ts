import { DocumentRepository, DocumentSimulator, newDocumentResource } from "../../Document/tests/core"

import { initMemoryApiCredentialRepository } from "../../../../auth/common/credential/impl/repository/apiCredential/memory"
import { initMemoryMenuExpandRepository } from "../../../../auth/permission/menu/impl/repository/menuExpand/memory"

import { MenuBadge, MenuTree } from "../../../../auth/permission/menu/infra"

import { ApiNonce, markApiNonce, markApiRoles } from "../../../../auth/common/credential/data"
import { ContentState } from "../component"

describe("Content", () => {
    test("load content", (done) => {
        const { resource } = standardResource()

        resource.content.onStateChange(stateHandler())

        resource.content.load()

        function stateHandler(): Post<ContentState> {
            const stack: ContentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-content":
                        // work in progress...
                        break

                    case "succeed-to-load":
                        expect(stack).toEqual([{ type: "succeed-to-load", path: "/docs/index.html" }])
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
    const menuTree = standardMenuTree()
    const repository = standardRepository()
    const simulator = standardSimulator()
    const resource = newDocumentResource(version, url, menuTree, repository, simulator)

    return { repository, resource }
}

function standardVersion(): string {
    return "1.0.0"
}

function standardURL(): URL {
    return new URL("https://example.com/1.0.0/docs/index.html")
}

function standardMenuTree(): MenuTree {
    return []
}

function standardRepository(): DocumentRepository {
    return {
        apiCredentials: initMemoryApiCredentialRepository(
            markApiNonce("api-nonce"),
            markApiRoles(["admin"])
        ),
        menuExpands: initMemoryMenuExpandRepository([]),
    }
}

function standardSimulator(): DocumentSimulator {
    return {
        menuBadge: {
            getMenuBadge: async (_apiNonce: ApiNonce): Promise<MenuBadge> => {
                return {}
            },
        },
    }
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
