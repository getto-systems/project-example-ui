import { LoadOutlineMenuLocationDetecter } from "../../../../auth/permission/outline/load/action"
import { outlineMenuExpandRepositoryConverter } from "../../../../auth/permission/outline/load/convert"
import { markOutlineMenuCategoryLabel_legacy } from "../../../../auth/permission/outline/load/data"
import {
    initOutlineBreadcrumbListAction,
    initOutlineMenuAction,
} from "../../../../auth/permission/outline/load/impl"
import {
    LoadOutlineMenuBadgeRemotePod,
    LoadOutlineMenuBadgeSimulator,
    OutlineMenuExpand,
    OutlineMenuExpandRepositoryPod,
    OutlineMenuExpandRepositoryValue,
    OutlineMenuTree,
} from "../../../../auth/permission/outline/load/infra"
import { initLoadOutlineMenuLocationDetecter } from "../../../../auth/permission/outline/load/testHelper"
import { initAsyncActionTester_legacy } from "../../../../z_vendor/getto-application/action/testHelper"
import { initRemoteSimulator } from "../../../../z_vendor/getto-application/infra/remote/simulate"
import { wrapRepository } from "../../../../z_vendor/getto-application/infra/repository/helper"
import { RepositoryFetchResult } from "../../../../z_vendor/getto-application/infra/repository/infra"
import { initMemoryDB } from "../../../../z_vendor/getto-application/infra/repository/memory"
import { AuthzRepositoryPod, AuthzRepositoryValue } from "../../../authz/infra"
import { BreadcrumbListComponentState } from "./BreadcrumbList/component"
import { initMenuResource } from "./impl"
import { MenuComponentState } from "./Menu/component"
import { MenuResource } from "./resource"

describe("BreadcrumbList", () => {
    test("load breadcrumb", (done) => {
        const { resource } = standardMenuResource()

        resource.breadcrumbList.subscriber.subscribe(initTester())

        resource.breadcrumbList.ignite()

        function initTester() {
            return initAsyncBreadcrumbListTester()((stack) => {
                expect(stack).toEqual([
                    {
                        type: "succeed-to-load",
                        breadcrumb: [category("MAIN"), item("ホーム", "home", "/1.0.0/index.html")],
                    },
                ])
                done()
            })
        }
    })

    test("load empty breadcrumb; unknown menu target", (done) => {
        const { resource } = unknownMenuResource()

        resource.breadcrumbList.subscriber.subscribe(initTester())

        resource.breadcrumbList.ignite()

        function initTester() {
            return initAsyncBreadcrumbListTester()((stack) => {
                expect(stack).toEqual([
                    {
                        type: "succeed-to-load",
                        breadcrumb: [],
                    },
                ])
                done()
            })
        }
    })

    function category(label: string) {
        return { type: "category", category: { label } }
    }
    function item(label: string, icon: string, href: string) {
        return { type: "item", item: { label, icon, href } }
    }
})

describe("Menu", () => {
    test("load menu", (done) => {
        const { resource } = standardMenuResource()

        resource.menu.subscriber.subscribe(initTester())

        resource.menu.ignite()

        function initTester() {
            return initAsyncMenuTester()((stack) => {
                expect(stack).toEqual([
                    {
                        type: "succeed-to-instant-load",
                        menu: [
                            category("MAIN", ["MAIN"], true, 0, [
                                item("ホーム", "home", "/1.0.0/index.html", true, 0),
                                item("ドキュメント", "docs", "/1.0.0/docs/index.html", false, 0),
                            ]),
                            category("DOCUMENT", ["DOCUMENT"], false, 0, [
                                item("認証・認可", "auth", "/1.0.0/docs/auth.html", false, 0),
                                category("DETAIL", ["DOCUMENT", "DETAIL"], false, 0, [
                                    item("詳細", "detail", "/1.0.0/docs/auth.html", false, 0),
                                ]),
                            ]),
                        ],
                    },
                    {
                        type: "succeed-to-load",
                        menu: [
                            category("MAIN", ["MAIN"], true, 30, [
                                item("ホーム", "home", "/1.0.0/index.html", true, 10),
                                item("ドキュメント", "docs", "/1.0.0/docs/index.html", false, 20),
                            ]),
                            category("DOCUMENT", ["DOCUMENT"], false, 0, [
                                item("認証・認可", "auth", "/1.0.0/docs/auth.html", false, 0),
                                category("DETAIL", ["DOCUMENT", "DETAIL"], false, 0, [
                                    item("詳細", "detail", "/1.0.0/docs/auth.html", false, 0),
                                ]),
                            ]),
                        ],
                    },
                ])
                done()
            })
        }
    })

    test("load menu; empty roles", (done) => {
        const { resource } = emptyMenuResource()

        resource.menu.subscriber.subscribe(initTester())

        resource.menu.ignite()

        function initTester() {
            return initAsyncMenuTester()((stack) => {
                expect(stack).toEqual([
                    {
                        type: "failed-to-fetch-repository",
                        err: { type: "not-found" },
                    },
                ])
                done()
            })
        }
    })

    test("load menu; saved expands", (done) => {
        const { resource } = expandMenuResource()

        resource.menu.subscriber.subscribe(initTester())

        resource.menu.ignite()

        function initTester() {
            return initAsyncMenuTester()((stack) => {
                expect(stack).toEqual([
                    {
                        type: "succeed-to-instant-load",
                        menu: [
                            category("MAIN", ["MAIN"], true, 0, [
                                item("ホーム", "home", "/1.0.0/index.html", true, 0),
                                item("ドキュメント", "docs", "/1.0.0/docs/index.html", false, 0),
                            ]),
                            category("DOCUMENT", ["DOCUMENT"], true, 0, [
                                item("認証・認可", "auth", "/1.0.0/docs/auth.html", false, 0),
                                category("DETAIL", ["DOCUMENT", "DETAIL"], false, 0, [
                                    item("詳細", "detail", "/1.0.0/docs/auth.html", false, 0),
                                ]),
                            ]),
                        ],
                    },
                    {
                        type: "succeed-to-load",
                        menu: [
                            category("MAIN", ["MAIN"], true, 30, [
                                item("ホーム", "home", "/1.0.0/index.html", true, 10),
                                item("ドキュメント", "docs", "/1.0.0/docs/index.html", false, 20),
                            ]),
                            category("DOCUMENT", ["DOCUMENT"], true, 0, [
                                item("認証・認可", "auth", "/1.0.0/docs/auth.html", false, 0),
                                category("DETAIL", ["DOCUMENT", "DETAIL"], false, 0, [
                                    item("詳細", "detail", "/1.0.0/docs/auth.html", false, 0),
                                ]),
                            ]),
                        ],
                    },
                ])
                done()
            })
        }
    })

    test("load menu; toggle expands", (done) => {
        const { repository, resource } = standardMenuResource()
        const menuExpands = repository.menuExpands(outlineMenuExpandRepositoryConverter)

        resource.menu.subscriber.subscribe(initNoopTester())

        resource.menu.ignite()

        function initNoopTester() {
            return initAsyncMenuTester()((stack) => {
                if (stack.length > 0) {
                    const last = stack[stack.length - 1]
                    if (last.type === "succeed-to-load") {
                        resource.menu.terminate()

                        resource.menu.subscriber.subscribe(initFirstToggleTester())
                        resource.menu.toggle(last.menu, [
                            markOutlineMenuCategoryLabel_legacy("DOCUMENT"),
                        ])
                    }
                }
            })
        }
        function initFirstToggleTester() {
            return initAsyncMenuTester()((stack) => {
                expect(stack).toEqual([
                    {
                        type: "succeed-to-toggle",
                        menu: [
                            category("MAIN", ["MAIN"], true, 30, [
                                item("ホーム", "home", "/1.0.0/index.html", true, 10),
                                item("ドキュメント", "docs", "/1.0.0/docs/index.html", false, 20),
                            ]),
                            category("DOCUMENT", ["DOCUMENT"], true, 0, [
                                item("認証・認可", "auth", "/1.0.0/docs/auth.html", false, 0),
                                category("DETAIL", ["DOCUMENT", "DETAIL"], false, 0, [
                                    item("詳細", "detail", "/1.0.0/docs/auth.html", false, 0),
                                ]),
                            ]),
                        ],
                    },
                ])

                if (stack.length > 0) {
                    const last = stack[stack.length - 1]
                    if (last.type === "succeed-to-toggle") {
                        resource.menu.terminate()

                        resource.menu.subscriber.subscribe(initSecondToggleTester())
                        resource.menu.toggle(last.menu, [
                            markOutlineMenuCategoryLabel_legacy("DOCUMENT"),
                            markOutlineMenuCategoryLabel_legacy("DETAIL"),
                        ])
                    }
                }
            })
        }
        function initSecondToggleTester() {
            return initAsyncMenuTester()((stack) => {
                expect(stack).toEqual([
                    {
                        type: "succeed-to-toggle",
                        menu: [
                            category("MAIN", ["MAIN"], true, 30, [
                                item("ホーム", "home", "/1.0.0/index.html", true, 10),
                                item("ドキュメント", "docs", "/1.0.0/docs/index.html", false, 20),
                            ]),
                            category("DOCUMENT", ["DOCUMENT"], true, 0, [
                                item("認証・認可", "auth", "/1.0.0/docs/auth.html", false, 0),
                                category("DETAIL", ["DOCUMENT", "DETAIL"], true, 0, [
                                    item("詳細", "detail", "/1.0.0/docs/auth.html", false, 0),
                                ]),
                            ]),
                        ],
                    },
                ])
                expectToSaveExpand(menuExpands.get(), [
                    ["MAIN"],
                    ["DOCUMENT"],
                    ["DOCUMENT", "DETAIL"],
                ])
                done()
            })
        }
    })

    test("load menu; development document", (done) => {
        const { resource } = developmentDocumentMenuResource()

        resource.menu.subscriber.subscribe(initTester())

        resource.menu.ignite()

        function initTester() {
            return initAsyncMenuTester()((stack) => {
                expect(stack).toEqual([
                    {
                        type: "succeed-to-instant-load",
                        menu: [
                            category("MAIN", ["MAIN"], true, 0, [
                                item("ホーム", "home", "/1.0.0/index.html", true, 0),
                                item("ドキュメント", "docs", "/1.0.0/docs/index.html", false, 0),
                            ]),
                            category("DOCUMENT", ["DOCUMENT"], false, 0, [
                                item("認証・認可", "auth", "/1.0.0/docs/auth.html", false, 0),
                                category("DETAIL", ["DOCUMENT", "DETAIL"], false, 0, [
                                    item("詳細", "detail", "/1.0.0/docs/auth.html", false, 0),
                                ]),
                            ]),
                            category("DEVELOPMENT", ["DEVELOPMENT"], false, 0, [
                                item(
                                    "配備構成",
                                    "deployment",
                                    "/1.0.0/docs/development/deployment.html",
                                    false,
                                    0,
                                ),
                            ]),
                        ],
                    },
                    {
                        type: "succeed-to-load",
                        menu: [
                            category("MAIN", ["MAIN"], true, 30, [
                                item("ホーム", "home", "/1.0.0/index.html", true, 10),
                                item("ドキュメント", "docs", "/1.0.0/docs/index.html", false, 20),
                            ]),
                            category("DOCUMENT", ["DOCUMENT"], false, 0, [
                                item("認証・認可", "auth", "/1.0.0/docs/auth.html", false, 0),
                                category("DETAIL", ["DOCUMENT", "DETAIL"], false, 0, [
                                    item("詳細", "detail", "/1.0.0/docs/auth.html", false, 0),
                                ]),
                            ]),
                            category("DEVELOPMENT", ["DEVELOPMENT"], false, 0, [
                                item(
                                    "配備構成",
                                    "deployment",
                                    "/1.0.0/docs/development/deployment.html",
                                    false,
                                    0,
                                ),
                            ]),
                        ],
                    },
                ])
                done()
            })
        }
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
    function category(
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
    function item(
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

function standardMenuResource() {
    const locationInfo = standardLocationInfo()
    const repository = standardRepository()
    const resource = newTestMenuResource(locationInfo, repository)

    return { repository, resource }
}
function emptyMenuResource() {
    const locationInfo = standardLocationInfo()
    const repository = emptyRepository()
    const resource = newTestMenuResource(locationInfo, repository)

    return { repository, resource }
}
function unknownMenuResource() {
    const locationInfo = unknownLocationInfo()
    const repository = standardRepository()
    const resource = newTestMenuResource(locationInfo, repository)

    return { resource }
}
function developmentDocumentMenuResource() {
    const locationInfo = standardLocationInfo()
    const repository = developmentDocumentRepository()
    const resource = newTestMenuResource(locationInfo, repository)

    return { resource }
}
function expandMenuResource() {
    const locationInfo = standardLocationInfo()
    const repository = expandRepository()
    const resource = newTestMenuResource(locationInfo, repository)

    return { resource }
}

type Repository = Readonly<{
    authz: AuthzRepositoryPod
    menuExpands: OutlineMenuExpandRepositoryPod
}>

function newTestMenuResource(
    locationInfo: LoadOutlineMenuLocationDetecter,
    repository: Repository,
): MenuResource {
    const version = standardVersion()
    const menuTree = standardMenuTree()

    return initMenuResource({
        breadcrumbList: initOutlineBreadcrumbListAction(locationInfo, {
            version,
            menuTree,
        }),
        menu: initOutlineMenuAction(locationInfo, {
            version,
            menuTree,
            loadMenuBadge: standardLoadMenuBadgeRemote(),
            ...repository,
        }),
    })
}

function standardLocationInfo(): LoadOutlineMenuLocationDetecter {
    return initLoadOutlineMenuLocationDetecter(
        new URL("https://example.com/1.0.0/index.html"),
        standardVersion(),
    )
}
function unknownLocationInfo(): LoadOutlineMenuLocationDetecter {
    return initLoadOutlineMenuLocationDetecter(
        new URL("https://example.com/1.0.0/unknown.html"),
        standardVersion(),
    )
}
function standardVersion(): string {
    return "1.0.0"
}

function standardMenuTree(): OutlineMenuTree {
    return [
        {
            type: "category",
            category: { label: "MAIN", permission: { type: "allow" } },
            children: [
                { type: "item", item: { label: "ホーム", icon: "home", path: "/index.html" } },
                {
                    type: "item",
                    item: { label: "ドキュメント", icon: "docs", path: "/docs/index.html" },
                },
            ],
        },
        {
            type: "category",
            category: { label: "DOCUMENT", permission: { type: "allow" } },
            children: [
                {
                    type: "item",
                    item: { label: "認証・認可", icon: "auth", path: "/docs/auth.html" },
                },
                {
                    type: "category",
                    category: { label: "DETAIL", permission: { type: "allow" } },
                    children: [
                        {
                            type: "item",
                            item: { label: "詳細", icon: "detail", path: "/docs/auth.html" },
                        },
                    ],
                },
            ],
        },
        {
            type: "category",
            category: {
                label: "DEVELOPMENT",
                permission: { type: "role", role: "development-document" },
            },
            children: [
                {
                    type: "item",
                    item: {
                        label: "配備構成",
                        icon: "deployment",
                        path: "/docs/development/deployment.html",
                    },
                },
            ],
        },
    ]
}

function standardRepository(): Repository {
    const authz = initMemoryDB<AuthzRepositoryValue>()
    authz.set({ nonce: "api-nonce", roles: ["admin"] })

    return {
        authz: wrapRepository(authz),
        menuExpands: standardMenuExpandRepository([]),
    }
}
function emptyRepository(): Repository {
    return {
        authz: wrapRepository(initMemoryDB<AuthzRepositoryValue>()),
        menuExpands: standardMenuExpandRepository([]),
    }
}
function developmentDocumentRepository(): Repository {
    const authz = initMemoryDB<AuthzRepositoryValue>()
    authz.set({
        nonce: "api-nonce",
        roles: ["admin", "development-document"],
    })

    return {
        authz: wrapRepository(authz),
        menuExpands: standardMenuExpandRepository([]),
    }
}
function expandRepository(): Repository {
    const authz = initMemoryDB<AuthzRepositoryValue>()
    authz.set({ nonce: "api-nonce", roles: ["admin"] })

    return {
        authz: wrapRepository(authz),
        menuExpands: standardMenuExpandRepository([
            [markOutlineMenuCategoryLabel_legacy("DOCUMENT")],
        ]),
    }
}

function standardLoadMenuBadgeRemote(): LoadOutlineMenuBadgeRemotePod {
    const simulator: LoadOutlineMenuBadgeSimulator = () => ({
        success: true,
        value: [
            { path: "/index.html", count: 10 },
            { path: "/docs/index.html", count: 20 },
        ],
    })
    return initRemoteSimulator(simulator, { wait_millisecond: 0 })
}

function standardMenuExpandRepository(
    menuExpand: OutlineMenuExpand,
): OutlineMenuExpandRepositoryPod {
    const menuExpands = initMemoryDB<OutlineMenuExpandRepositoryValue>()
    menuExpands.set(menuExpand)
    return wrapRepository(menuExpands)
}

function expectToSaveExpand(
    result: RepositoryFetchResult<OutlineMenuExpand>,
    menuExpand: OutlineMenuExpandRepositoryValue,
) {
    expect(result).toEqual({ success: true, found: true, value: menuExpand })
}

function initAsyncBreadcrumbListTester() {
    return initAsyncActionTester_legacy((state: BreadcrumbListComponentState) => {
        switch (state.type) {
            case "initial-breadcrumb-list":
                return false

            case "succeed-to-load":
                return true
        }
    })
}
function initAsyncMenuTester() {
    return initAsyncActionTester_legacy((state: MenuComponentState) => {
        switch (state.type) {
            case "initial-menu":
            case "succeed-to-instant-load":
                return false

            case "succeed-to-load":
            case "failed-to-load":
            case "failed-to-fetch-repository":
            case "succeed-to-toggle":
            case "failed-to-toggle":
                return true
        }
    })
}
