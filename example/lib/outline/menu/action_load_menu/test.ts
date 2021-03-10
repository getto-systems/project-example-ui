import {
    setupAsyncActionTestRunner,
    setupSyncActionTestRunner,
} from "../../../z_vendor/getto-application/action/test_helper"

import { markMenuCategoryLabel, standard_MenuTree } from "../kernel/impl/test_helper"

import { wrapRepository } from "../../../z_vendor/getto-application/infra/repository/helper"
import { initRemoteSimulator } from "../../../z_vendor/getto-application/infra/remote/simulate"
import { initMemoryDB } from "../../../z_vendor/getto-application/infra/repository/memory"

import { initLoadMenuLocationDetecter } from "../kernel/init/testHelper"

import { initLoadMenuCoreAction, initLoadMenuCoreMaterial } from "./core/impl"

import { menuExpandRepositoryConverter } from "../kernel/impl/convert"
import { loadMenuEventHasDone } from "../load_menu/impl/core"
import { updateMenuBadgeEventHasDone } from "../update_menu_badge/impl/core"
import { toggleMenuExpandEventHasDone } from "../toggle_menu_expand/impl/core"

import { AuthzRepositoryPod } from "../../../common/authz/infra"
import { GetMenuBadgeRemotePod, MenuExpandRepositoryPod } from "../kernel/infra"

import { LoadMenuResource } from "./resource"
import { LoadMenuCoreState } from "./core/action"

import { LoadMenuLocationDetecter } from "../kernel/method"

describe("Menu", () => {
    test("load menu", (done) => {
        const { resource } = standard_elements()

        const runner = setupAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.menu.ignite()
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        {
                            type: "succeed-to-load",
                            menu: [
                                $category("MAIN", ["MAIN"], 0, [
                                    $item("ホーム", "home", "/1.0.0/index.html", 0),
                                    item("ドキュメント", "docs", "/1.0.0/docs/index.html", 0),
                                ]),
                                category("DOCUMENT", ["DOCUMENT"], 0, [
                                    item("認証・認可", "auth", "/1.0.0/docs/auth.html", 0),
                                    category("DETAIL", ["DOCUMENT", "DETAIL"], 0, [
                                        item("詳細", "detail", "/1.0.0/docs/auth.html", 0),
                                    ]),
                                ]),
                            ],
                        },
                        {
                            type: "succeed-to-update",
                            menu: [
                                $category("MAIN", ["MAIN"], 30, [
                                    $item("ホーム", "home", "/1.0.0/index.html", 10),
                                    item("ドキュメント", "docs", "/1.0.0/docs/index.html", 20),
                                ]),
                                category("DOCUMENT", ["DOCUMENT"], 0, [
                                    item("認証・認可", "auth", "/1.0.0/docs/auth.html", 0),
                                    category("DETAIL", ["DOCUMENT", "DETAIL"], 0, [
                                        item("詳細", "detail", "/1.0.0/docs/auth.html", 0),
                                    ]),
                                ]),
                            ],
                        },
                    ])
                },
            },
        ])

        resource.menu.subscriber.subscribe(runner(done))
    })

    test("load menu; empty roles", (done) => {
        const { resource } = empty_elements()

        const runner = setupAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.menu.ignite()
                },
                examine: (stack) => {
                    expect(stack).toEqual([{ type: "required-to-login" }])
                },
            },
        ])

        resource.menu.subscriber.subscribe(runner(done))
    })

    test("load menu; saved expands", (done) => {
        const { resource } = expand_elements()

        const runner = setupAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.menu.ignite()
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        {
                            type: "succeed-to-load",
                            menu: [
                                $category("MAIN", ["MAIN"], 0, [
                                    $item("ホーム", "home", "/1.0.0/index.html", 0),
                                    item("ドキュメント", "docs", "/1.0.0/docs/index.html", 0),
                                ]),
                                $category("DOCUMENT", ["DOCUMENT"], 0, [
                                    item("認証・認可", "auth", "/1.0.0/docs/auth.html", 0),
                                    category("DETAIL", ["DOCUMENT", "DETAIL"], 0, [
                                        item("詳細", "detail", "/1.0.0/docs/auth.html", 0),
                                    ]),
                                ]),
                            ],
                        },
                        {
                            type: "succeed-to-update",
                            menu: [
                                $category("MAIN", ["MAIN"], 30, [
                                    $item("ホーム", "home", "/1.0.0/index.html", 10),
                                    item("ドキュメント", "docs", "/1.0.0/docs/index.html", 20),
                                ]),
                                $category("DOCUMENT", ["DOCUMENT"], 0, [
                                    item("認証・認可", "auth", "/1.0.0/docs/auth.html", 0),
                                    category("DETAIL", ["DOCUMENT", "DETAIL"], 0, [
                                        item("詳細", "detail", "/1.0.0/docs/auth.html", 0),
                                    ]),
                                ]),
                            ],
                        },
                    ])
                },
            },
        ])

        resource.menu.subscriber.subscribe(runner(done))
    })

    test("load menu; toggle expands", (done) => {
        const { resource, repository } = standard_elements()
        const menuExpand = repository.menuExpand(menuExpandRepositoryConverter)

        const runner = setupAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.menu.ignite()
                },
                examine: () => {
                    // load のテストは他でやる
                },
            },
            {
                statement: () => {
                    resource.menu.toggle([markMenuCategoryLabel("DOCUMENT")])
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        {
                            type: "succeed-to-toggle",
                            menu: [
                                $category("MAIN", ["MAIN"], 30, [
                                    $item("ホーム", "home", "/1.0.0/index.html", 10),
                                    item("ドキュメント", "docs", "/1.0.0/docs/index.html", 20),
                                ]),
                                $category("DOCUMENT", ["DOCUMENT"], 0, [
                                    item("認証・認可", "auth", "/1.0.0/docs/auth.html", 0),
                                    category("DETAIL", ["DOCUMENT", "DETAIL"], 0, [
                                        item("詳細", "detail", "/1.0.0/docs/auth.html", 0),
                                    ]),
                                ]),
                            ],
                        },
                    ])
                },
            },
            {
                statement: () => {
                    resource.menu.toggle([
                        markMenuCategoryLabel("DOCUMENT"),
                        markMenuCategoryLabel("DETAIL"),
                    ])
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        {
                            type: "succeed-to-toggle",
                            menu: [
                                $category("MAIN", ["MAIN"], 30, [
                                    $item("ホーム", "home", "/1.0.0/index.html", 10),
                                    item("ドキュメント", "docs", "/1.0.0/docs/index.html", 20),
                                ]),
                                $category("DOCUMENT", ["DOCUMENT"], 0, [
                                    item("認証・認可", "auth", "/1.0.0/docs/auth.html", 0),
                                    $category("DETAIL", ["DOCUMENT", "DETAIL"], 0, [
                                        item("詳細", "detail", "/1.0.0/docs/auth.html", 0),
                                    ]),
                                ]),
                            ],
                        },
                    ])

                    const result = menuExpand.get()
                    if (!result.success) {
                        fail("menu expand get failed")
                    }
                    if (!result.found) {
                        fail("menu expand not found")
                    }
                    expect(result.value.values).toEqual([
                        ["DOCUMENT"],
                        ["DOCUMENT", "DETAIL"],
                    ])
                },
            },
        ])

        resource.menu.subscriber.subscribe(runner(done))
    })

    test("load menu; dev docs", (done) => {
        const { resource } = devDocs_elements()

        const runner = setupAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.menu.ignite()
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        {
                            type: "succeed-to-load",
                            menu: [
                                $category("MAIN", ["MAIN"], 0, [
                                    $item("ホーム", "home", "/1.0.0/index.html", 0),
                                    item("ドキュメント", "docs", "/1.0.0/docs/index.html", 0),
                                ]),
                                category("DOCUMENT", ["DOCUMENT"], 0, [
                                    item("認証・認可", "auth", "/1.0.0/docs/auth.html", 0),
                                    category("DETAIL", ["DOCUMENT", "DETAIL"], 0, [
                                        item("詳細", "detail", "/1.0.0/docs/auth.html", 0),
                                    ]),
                                ]),
                                category("DEVELOPMENT", ["DEVELOPMENT"], 0, [
                                    item(
                                        "配備構成",
                                        "deployment",
                                        "/1.0.0/docs/z_dev/deployment.html",
                                        0,
                                    ),
                                ]),
                            ],
                        },
                        {
                            type: "succeed-to-update",
                            menu: [
                                $category("MAIN", ["MAIN"], 30, [
                                    $item("ホーム", "home", "/1.0.0/index.html", 10),
                                    item("ドキュメント", "docs", "/1.0.0/docs/index.html", 20),
                                ]),
                                category("DOCUMENT", ["DOCUMENT"], 0, [
                                    item("認証・認可", "auth", "/1.0.0/docs/auth.html", 0),
                                    category("DETAIL", ["DOCUMENT", "DETAIL"], 0, [
                                        item("詳細", "detail", "/1.0.0/docs/auth.html", 0),
                                    ]),
                                ]),
                                category("DEVELOPMENT", ["DEVELOPMENT"], 0, [
                                    item(
                                        "配備構成",
                                        "deployment",
                                        "/1.0.0/docs/z_dev/deployment.html",
                                        0,
                                    ),
                                ]),
                            ],
                        },
                    ])
                },
            },
        ])

        resource.menu.subscriber.subscribe(runner(done))
    })

    test("terminate", (done) => {
        const { resource } = standard_elements()

        const runner = setupSyncActionTestRunner([
            {
                statement: (check) => {
                    resource.menu.terminate()
                    resource.menu.ignite()

                    setTimeout(check, 256) // wait for event...
                },
                examine: (stack) => {
                    // no input/validate event after terminate
                    expect(stack).toEqual([])
                },
            },
        ])

        resource.menu.subscriber.subscribe(runner(done))
    })

    type MenuNode =
        | Readonly<{
              type: "category"
              category: Readonly<{ label: string }>
              path: string[]
              isExpand: boolean
              badgeCount: number
              children: MenuNode[]
          }>
        | Readonly<{
              type: "item"
              item: Readonly<{ label: string; icon: string; href: string }>
              isActive: boolean
              badgeCount: number
          }>

    function category(label: string, path: string[], badgeCount: number, children: MenuNode[]) {
        return categoryNode(label, path, false, badgeCount, children)
    }
    function $category(label: string, path: string[], badgeCount: number, children: MenuNode[]) {
        return categoryNode(label, path, true, badgeCount, children)
    }
    function categoryNode(
        label: string,
        path: string[],
        isExpand: boolean,
        badgeCount: number,
        children: MenuNode[],
    ): MenuNode {
        return {
            type: "category",
            category: { label },
            path,
            isExpand,
            badgeCount,
            children,
        }
    }

    function item(label: string, icon: string, href: string, badgeCount: number) {
        return itemNode(label, icon, href, false, badgeCount)
    }
    function $item(label: string, icon: string, href: string, badgeCount: number) {
        return itemNode(label, icon, href, true, badgeCount)
    }
    function itemNode(
        label: string,
        icon: string,
        href: string,
        isActive: boolean,
        badgeCount: number,
    ): MenuNode {
        return {
            type: "item",
            item: { label, icon, href },
            isActive,
            badgeCount,
        }
    }
})

function standard_elements() {
    const [resource, menuExpand] = newResource(standard_authz(), empty_menuExpand())

    return { resource, repository: { menuExpand } }
}
function empty_elements() {
    const [resource] = newResource(empty_authz(), empty_menuExpand())

    return { resource }
}
function devDocs_elements() {
    const [resource] = newResource(devDocs_authz(), empty_menuExpand())

    return { resource }
}
function expand_elements() {
    const [resource] = newResource(standard_authz(), expand_menuExpand())

    return { resource }
}

function newResource(
    authz: AuthzRepositoryPod,
    menuExpand: MenuExpandRepositoryPod,
): [LoadMenuResource, MenuExpandRepositoryPod] {
    const version = standard_version()
    const detecter = standard_detecter()
    const getMenuBadge = standard_getMenuBadge()

    return [
        {
            menu: initLoadMenuCoreAction(
                initLoadMenuCoreMaterial(
                    {
                        version,
                        menuTree: standard_MenuTree(),
                        authz,
                        menuExpand,
                        getMenuBadge,
                    },
                    detecter,
                ),
            ),
        },
        menuExpand,
    ]
}

function standard_detecter(): LoadMenuLocationDetecter {
    return initLoadMenuLocationDetecter(
        new URL("https://example.com/1.0.0/index.html"),
        standard_version(),
    )
}
function standard_version(): string {
    return "1.0.0"
}

function standard_authz(): AuthzRepositoryPod {
    const authz = initMemoryDB()
    authz.set({ nonce: "api-nonce", roles: ["admin"] })
    return wrapRepository(authz)
}
function empty_authz(): AuthzRepositoryPod {
    return wrapRepository(initMemoryDB())
}
function devDocs_authz(): AuthzRepositoryPod {
    const authz = initMemoryDB()
    authz.set({ nonce: "api-nonce", roles: ["admin", "dev-docs"] })
    return wrapRepository(authz)
}

function empty_menuExpand(): MenuExpandRepositoryPod {
    return wrapRepository(initMemoryDB())
}
function expand_menuExpand(): MenuExpandRepositoryPod {
    const menuExpand = initMemoryDB()
    menuExpand.set([[markMenuCategoryLabel("DOCUMENT")]])
    return wrapRepository(menuExpand)
}

function standard_getMenuBadge(): GetMenuBadgeRemotePod {
    return initRemoteSimulator(
        () => ({
            success: true,
            value: [
                { path: "/index.html", count: 10 },
                { path: "/docs/index.html", count: 20 },
            ],
        }),
        { wait_millisecond: 0 },
    )
}

function actionHasDone(state: LoadMenuCoreState): boolean {
    switch (state.type) {
        case "initial-menu":
            return false

        case "failed-to-fetch-menu":
            return true

        case "succeed-to-load":
        case "required-to-login":
        case "repository-error":
            // カバレッジのため、loadMenuEventHasDone はコールしたい
            // が、succeed-to-load では hasDone しない
            return loadMenuEventHasDone(state) && state.type !== "succeed-to-load"

        case "succeed-to-update":
        case "failed-to-update":
            return updateMenuBadgeEventHasDone(state)

        case "succeed-to-toggle":
            return toggleMenuExpandEventHasDone(state)
    }
}
