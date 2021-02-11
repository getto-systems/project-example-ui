import { DocumentRepository, DocumentRemoteAccess, newTestDocumentResource } from "../../EntryPoint/tests/core"

import { initMemoryTypedStorage } from "../../../../../z_infra/storage/memory"
import { initLoadMenuBadgeSimulateRemoteAccess } from "../../../../../auth/permission/menu/impl/remote/menuBadge/simulate"
import { initApiCredentialRepository } from "../../../../../auth/common/credential/impl/repository/apiCredential"
import { initMenuExpandRepository } from "../../../../../auth/permission/menu/impl/repository/menuExpand"

import { MenuTree } from "../../../../../auth/permission/menu/infra"

import { ContentComponentState } from "../component"

import { markApiCredential } from "../../../../../auth/common/credential/data"

describe("Content", () => {
    test("load content", (done) => {
        const { resource } = standardResource()

        resource.content.addStateHandler(stateHandler())

        resource.content.load()

        function stateHandler(): Post<ContentComponentState> {
            const stack: ContentComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-content":
                        // work in progress...
                        break

                    case "succeed-to-load":
                        expect(stack).toEqual([{ type: "succeed-to-load", path: "/document/index.html" }])
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
    return new URL("https://example.com/1.0.0/document/index.html")
}

function standardMenuTree(): MenuTree {
    return []
}

function standardRepository(): DocumentRepository {
    return {
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
    }
}

function standardSimulator(): DocumentRemoteAccess {
    return {
        loadMenuBadge: initLoadMenuBadgeSimulateRemoteAccess(() => ({ success: true, value: {} }), {
            wait_millisecond: 0,
        }),
    }
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
