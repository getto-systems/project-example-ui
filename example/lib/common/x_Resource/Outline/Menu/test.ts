import { OutlineActionLocationInfo } from "../../../../auth/permission/outline/action"
import { markOutlineMenuCategoryLabel } from "../../../../auth/permission/outline/data"
import {
    initOutlineBreadcrumbListAction,
    initOutlineMenuAction,
    initOutlineActionLocationInfo,
} from "../../../../auth/permission/outline/impl"
import { OutlineMenuExpand, OutlineMenuExpandRepository, OutlineMenuTree } from "../../../../auth/permission/outline/infra"
import { initLoadOutlineMenuBadgeSimulateRemoteAccess } from "../../../../auth/permission/outline/infra/remote/loadOutlineMenuBadge/simulate"
import { initMemoryOutlineMenuExpandRepository } from "../../../../auth/permission/outline/infra/repository/outlineMenuExpand/memory"
import { initAsyncComponentStateTester } from "../../../../vendor/getto-example/Application/testHelper"
import { markApiNonce, markApiRoles } from "../../../apiCredential/data"
import { ApiCredentialRepository } from "../../../apiCredential/infra"
import { initMemoryApiCredentialRepository } from "../../../apiCredential/infra/repository/memory"
import { BreadcrumbListComponentState } from "./BreadcrumbList/component"
import { initMenuResource } from "./impl"
import { MenuComponentState } from "./Menu/component"
import { MenuResource } from "./resource"

describe("BreadcrumbList", () => {
    test("load breadcrumb", (done) => {
        const { resource } = standardMenuResource()

        resource.breadcrumbList.addStateHandler(initTester())

        resource.breadcrumbList.load()

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

        resource.breadcrumbList.addStateHandler(initTester())

        resource.breadcrumbList.load()

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

        resource.menu.addStateHandler(initTester())

        resource.menu.load()

        function initTester() {
            return initAsyncMenuTester()((stack) => {
                expect(stack).toEqual([
                    {
                        type: "succeed-to-instant-load",
                        menu: [
                            category("MAIN", ["MAIN"], true, 0, [
                                item("ホーム", "home", "/1.0.0/index.html", true, 0),
                                item("ドキュメント", "docs", "/1.0.0/document/index.html", false, 0),
                            ]),
                            category("DOCUMENT", ["DOCUMENT"], false, 0, [
                                item("認証・認可", "auth", "/1.0.0/document/auth.html", false, 0),
                                category("DETAIL", ["DOCUMENT", "DETAIL"], false, 0, [
                                    item("詳細", "detail", "/1.0.0/document/auth.html", false, 0),
                                ]),
                            ]),
                        ],
                    },
                    {
                        type: "succeed-to-load",
                        menu: [
                            category("MAIN", ["MAIN"], true, 30, [
                                item("ホーム", "home", "/1.0.0/index.html", true, 10),
                                item("ドキュメント", "docs", "/1.0.0/document/index.html", false, 20),
                            ]),
                            category("DOCUMENT", ["DOCUMENT"], false, 0, [
                                item("認証・認可", "auth", "/1.0.0/document/auth.html", false, 0),
                                category("DETAIL", ["DOCUMENT", "DETAIL"], false, 0, [
                                    item("詳細", "detail", "/1.0.0/document/auth.html", false, 0),
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

        resource.menu.addStateHandler(initTester())

        resource.menu.load()

        function initTester() {
            return initAsyncMenuTester()((stack) => {
                expect(stack).toEqual([
                    {
                        type: "succeed-to-instant-load",
                        menu: [
                            category("MAIN", ["MAIN"], true, 0, [
                                item("ホーム", "home", "/1.0.0/index.html", true, 0),
                                item("ドキュメント", "docs", "/1.0.0/document/index.html", false, 0),
                            ]),
                            category("DOCUMENT", ["DOCUMENT"], false, 0, [
                                item("認証・認可", "auth", "/1.0.0/document/auth.html", false, 0),
                                category("DETAIL", ["DOCUMENT", "DETAIL"], false, 0, [
                                    item("詳細", "detail", "/1.0.0/document/auth.html", false, 0),
                                ]),
                            ]),
                        ],
                    },
                    {
                        type: "failed-to-load",
                        err: { type: "empty-nonce" },
                        menu: [
                            category("MAIN", ["MAIN"], true, 0, [
                                item("ホーム", "home", "/1.0.0/index.html", true, 0),
                                item("ドキュメント", "docs", "/1.0.0/document/index.html", false, 0),
                            ]),
                            category("DOCUMENT", ["DOCUMENT"], false, 0, [
                                item("認証・認可", "auth", "/1.0.0/document/auth.html", false, 0),
                                category("DETAIL", ["DOCUMENT", "DETAIL"], false, 0, [
                                    item("詳細", "detail", "/1.0.0/document/auth.html", false, 0),
                                ]),
                            ]),
                        ],
                    },
                ])
                done()
            })
        }
    })

    test("load menu; saved expands", (done) => {
        const { resource } = expandMenuResource()

        resource.menu.addStateHandler(initTester())

        resource.menu.load()

        function initTester() {
            return initAsyncMenuTester()((stack) => {
                expect(stack).toEqual([
                    {
                        type: "succeed-to-instant-load",
                        menu: [
                            category("MAIN", ["MAIN"], true, 0, [
                                item("ホーム", "home", "/1.0.0/index.html", true, 0),
                                item("ドキュメント", "docs", "/1.0.0/document/index.html", false, 0),
                            ]),
                            category("DOCUMENT", ["DOCUMENT"], true, 0, [
                                item("認証・認可", "auth", "/1.0.0/document/auth.html", false, 0),
                                category("DETAIL", ["DOCUMENT", "DETAIL"], false, 0, [
                                    item("詳細", "detail", "/1.0.0/document/auth.html", false, 0),
                                ]),
                            ]),
                        ],
                    },
                    {
                        type: "succeed-to-load",
                        menu: [
                            category("MAIN", ["MAIN"], true, 30, [
                                item("ホーム", "home", "/1.0.0/index.html", true, 10),
                                item("ドキュメント", "docs", "/1.0.0/document/index.html", false, 20),
                            ]),
                            category("DOCUMENT", ["DOCUMENT"], true, 0, [
                                item("認証・認可", "auth", "/1.0.0/document/auth.html", false, 0),
                                category("DETAIL", ["DOCUMENT", "DETAIL"], false, 0, [
                                    item("詳細", "detail", "/1.0.0/document/auth.html", false, 0),
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

        resource.menu.addStateHandler(initNoopTester())
        resource.menu.load()

        function initNoopTester() {
            return initAsyncMenuTester()((stack) => {
                if (stack.length > 0) {
                    const last = stack[stack.length - 1]
                    if (last.type === "succeed-to-load") {
                        resource.menu.terminate()

                        resource.menu.addStateHandler(initFirstToggleTester())
                        resource.menu.toggle(last.menu, [markOutlineMenuCategoryLabel("DOCUMENT")])
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
                                item("ドキュメント", "docs", "/1.0.0/document/index.html", false, 20),
                            ]),
                            category("DOCUMENT", ["DOCUMENT"], true, 0, [
                                item("認証・認可", "auth", "/1.0.0/document/auth.html", false, 0),
                                category("DETAIL", ["DOCUMENT", "DETAIL"], false, 0, [
                                    item("詳細", "detail", "/1.0.0/document/auth.html", false, 0),
                                ]),
                            ]),
                        ],
                    },
                ])

                if (stack.length > 0) {
                    const last = stack[stack.length - 1]
                    if (last.type === "succeed-to-toggle") {
                        resource.menu.terminate()

                        resource.menu.addStateHandler(initSecondToggleTester())
                        resource.menu.toggle(last.menu, [
                            markOutlineMenuCategoryLabel("DOCUMENT"),
                            markOutlineMenuCategoryLabel("DETAIL"),
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
                                item("ドキュメント", "docs", "/1.0.0/document/index.html", false, 20),
                            ]),
                            category("DOCUMENT", ["DOCUMENT"], true, 0, [
                                item("認証・認可", "auth", "/1.0.0/document/auth.html", false, 0),
                                category("DETAIL", ["DOCUMENT", "DETAIL"], true, 0, [
                                    item("詳細", "detail", "/1.0.0/document/auth.html", false, 0),
                                ]),
                            ]),
                        ],
                    },
                ])
                expectToSaveExpand(repository, [["MAIN"], ["DOCUMENT"], ["DOCUMENT", "DETAIL"]])
                done()
            })
        }
    })

    test("load menu; development document", (done) => {
        const { resource } = developmentDocumentMenuResource()

        resource.menu.addStateHandler(initTester())

        resource.menu.load()

        function initTester() {
            return initAsyncMenuTester()((stack) => {
                expect(stack).toEqual([
                    {
                        type: "succeed-to-instant-load",
                        menu: [
                            category("MAIN", ["MAIN"], true, 0, [
                                item("ホーム", "home", "/1.0.0/index.html", true, 0),
                                item("ドキュメント", "docs", "/1.0.0/document/index.html", false, 0),
                            ]),
                            category("DOCUMENT", ["DOCUMENT"], false, 0, [
                                item("認証・認可", "auth", "/1.0.0/document/auth.html", false, 0),
                                category("DETAIL", ["DOCUMENT", "DETAIL"], false, 0, [
                                    item("詳細", "detail", "/1.0.0/document/auth.html", false, 0),
                                ]),
                            ]),
                            category("DEVELOPMENT", ["DEVELOPMENT"], false, 0, [
                                item(
                                    "配備構成",
                                    "deployment",
                                    "/1.0.0/document/development/deployment.html",
                                    false,
                                    0
                                ),
                            ]),
                        ],
                    },
                    {
                        type: "succeed-to-load",
                        menu: [
                            category("MAIN", ["MAIN"], true, 30, [
                                item("ホーム", "home", "/1.0.0/index.html", true, 10),
                                item("ドキュメント", "docs", "/1.0.0/document/index.html", false, 20),
                            ]),
                            category("DOCUMENT", ["DOCUMENT"], false, 0, [
                                item("認証・認可", "auth", "/1.0.0/document/auth.html", false, 0),
                                category("DETAIL", ["DOCUMENT", "DETAIL"], false, 0, [
                                    item("詳細", "detail", "/1.0.0/document/auth.html", false, 0),
                                ]),
                            ]),
                            category("DEVELOPMENT", ["DEVELOPMENT"], false, 0, [
                                item(
                                    "配備構成",
                                    "deployment",
                                    "/1.0.0/document/development/deployment.html",
                                    false,
                                    0
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
        children: MenuNode[]
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
        badgeCount: number
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
    apiCredentials: ApiCredentialRepository
    menuExpands: OutlineMenuExpandRepository
}>

function newTestMenuResource(
    locationInfo: OutlineActionLocationInfo,
    repository: Repository
): MenuResource {
    const menuTree = standardMenuTree()

    return initMenuResource({
        breadcrumbList: initOutlineBreadcrumbListAction(locationInfo, {
            menuTree,
        }),
        menu: initOutlineMenuAction(locationInfo, {
            ...standardRemoteAccess(),
            ...repository,
            menuTree,
        }),
    })
}

function standardLocationInfo(): OutlineActionLocationInfo {
    return initOutlineActionLocationInfo(
        standardVersion(),
        new URL("https://example.com/1.0.0/index.html")
    )
}
function unknownLocationInfo(): OutlineActionLocationInfo {
    return initOutlineActionLocationInfo(
        standardVersion(),
        new URL("https://example.com/1.0.0/unknown.html")
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
                    item: { label: "ドキュメント", icon: "docs", path: "/document/index.html" },
                },
            ],
        },
        {
            type: "category",
            category: { label: "DOCUMENT", permission: { type: "allow" } },
            children: [
                {
                    type: "item",
                    item: { label: "認証・認可", icon: "auth", path: "/document/auth.html" },
                },
                {
                    type: "category",
                    category: { label: "DETAIL", permission: { type: "allow" } },
                    children: [
                        {
                            type: "item",
                            item: { label: "詳細", icon: "detail", path: "/document/auth.html" },
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
                        path: "/document/development/deployment.html",
                    },
                },
            ],
        },
    ]
}

function standardRepository(): Repository {
    return {
        apiCredentials: initMemoryApiCredentialRepository({
            set: true,
            value: { apiNonce: markApiNonce("api-nonce"), apiRoles: markApiRoles(["admin"]) },
        }),
        menuExpands: standardMenuExpandRepository([]),
    }
}
function emptyRepository(): Repository {
    return {
        apiCredentials: initMemoryApiCredentialRepository({
            set: false,
        }),
        menuExpands: standardMenuExpandRepository([]),
    }
}
function developmentDocumentRepository(): Repository {
    return {
        apiCredentials: initMemoryApiCredentialRepository({
            set: true,
            value: {
                apiNonce: markApiNonce("api-nonce"),
                apiRoles: markApiRoles(["admin", "development-document"]),
            },
        }),
        menuExpands: standardMenuExpandRepository([]),
    }
}
function expandRepository(): Repository {
    return {
        apiCredentials: initMemoryApiCredentialRepository({
            set: true,
            value: { apiNonce: markApiNonce("api-nonce"), apiRoles: markApiRoles(["admin"]) },
        }),
        menuExpands: standardMenuExpandRepository([[markOutlineMenuCategoryLabel("DOCUMENT")]]),
    }
}

function standardRemoteAccess() {
    return {
        loadMenuBadge: initLoadOutlineMenuBadgeSimulateRemoteAccess(
            () => ({
                success: true,
                value: {
                    "/index.html": 10,
                    "/document/index.html": 20,
                },
            }),
            { wait_millisecond: 0 }
        ),
    }
}

function standardMenuExpandRepository(menuExpand: OutlineMenuExpand): OutlineMenuExpandRepository {
    return initMemoryOutlineMenuExpandRepository({ menuExpand: { set: true, value: menuExpand } })
}

function expectToSaveExpand(repository: Repository, menuExpand: string[][]) {
    expect(repository.menuExpands.load()).toEqual({ success: true, menuExpand })
}

function initAsyncBreadcrumbListTester() {
    return initAsyncComponentStateTester((state: BreadcrumbListComponentState) => {
        switch (state.type) {
            case "initial-breadcrumb-list":
                return false

            case "succeed-to-load":
                return true
        }
    })
}
function initAsyncMenuTester() {
    return initAsyncComponentStateTester((state: MenuComponentState) => {
        switch (state.type) {
            case "initial-menu":
            case "succeed-to-instant-load":
                return false

            case "succeed-to-load":
            case "failed-to-load":
            case "succeed-to-toggle":
            case "failed-to-toggle":
                return true
        }
    })
}
