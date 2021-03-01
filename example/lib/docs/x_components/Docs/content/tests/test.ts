import { DocumentRemoteAccess, newTestDocumentResource } from "../../EntryPoint/tests/core"

import { initMemoryTypedStorage } from "../../../../../z_vendor/getto-application/infra/storage/typed/memory"
import { initOutlineMenuExpandRepository } from "../../../../../auth/permission/outline/load/infra/repository/outlineMenuExpand/core"

import { OutlineMenuTree } from "../../../../../auth/permission/outline/load/infra"

import { ContentComponentState } from "../component"
import { newLoadOutlineMenuBadgeNoopRemote } from "../../../../../auth/permission/outline/load/infra/remote/loadMenuBadge/noop"
import { AuthzRepositoryPod, AuthzRepositoryValue } from "../../../../../common/authz/infra"
import { initMemoryDB } from "../../../../../z_vendor/getto-application/infra/repository/memory"
import { wrapRepository } from "../../../../../z_vendor/getto-application/infra/repository/helper"

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
                            { type: "succeed-to-load", path: "/docs/index.html" },
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
    const menuTree = standardMenuTree()
    const repository = standardRepository()
    const simulator = standardSimulator()
    const resource = newTestDocumentResource(version, url, menuTree, repository, simulator)

    return { repository, resource }
}

function standardVersion(): string {
    return "1.0.0"
}

function standardURL(): URL {
    return new URL("https://example.com/1.0.0/docs/index.html")
}

function standardMenuTree(): OutlineMenuTree {
    return []
}

function standardRepository() {
    const authz = initMemoryDB<AuthzRepositoryValue>()
    authz.set({ nonce: "api-nonce", roles: ["role"] })

    return {
        authz: <AuthzRepositoryPod>wrapRepository(authz),
        menuExpands: initOutlineMenuExpandRepository({
            menuExpand: initMemoryTypedStorage({ set: false }),
        }),
    }
}

function standardSimulator(): DocumentRemoteAccess {
    return {
        loadMenuBadge: newLoadOutlineMenuBadgeNoopRemote(),
    }
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
